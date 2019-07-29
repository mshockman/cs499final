import os
import datetime
from hashlib import sha256
import base64
from functools import wraps

from pyramid.session import signed_deserialize, signed_serialize

from .models import Session


try:
    import cPickle
except ImportError:
    # noinspection PyPep8Naming
    import pickle as cPickle


def generate_session_id():
    """Generates a random 64 character session id."""
    rand = os.urandom(20)
    return sha256(sha256(rand).digest()).hexdigest()


def get_session_id(request, cookie_name, secret):
    """
    Gets the session id from the request.
    :param request:
    :param cookie_name:
    :param secret:
    :return:
    """
    session_id = request.cookies.get(cookie_name, None)

    if session_id is not None:
        return signed_deserialize(session_id, secret)


def set_session_id(response, cookie_name, secret, session_id, **kwargs):
    """
    Sets the session id on the response.
    :param response:
    :param cookie_name:
    :param secret:
    :param session_id:
    :return:
    """
    response.set_cookie(cookie_name, signed_serialize(session_id, secret), **kwargs)
    return response


def changed(method):
    """
    Decorator method that sets the changed and accessed flags when the method is called.
    :param method:
    :return:
    """
    @wraps(method)
    def _changed(self, *args, **kwargs):
        self._changed = True
        self._accessed = True
        return method(self, *args, **kwargs)
    return _changed


def accessed(method):
    """
    Decorator method that sets the accessed flag when the decorator is called.
    :param method:
    :return:
    """
    @wraps(method)
    def _accessed(self, *args, **kwargs):
        self._accessed = True
        return method(self, *args, **kwargs)
    return _accessed


def postgres_session_factory(
        secret,
        cookie_name='session',
        timeout=3600,
        path="/",
        domain=None,
        serialize=lambda obj: base64.b64encode(cPickle.dumps(obj)).decode("UTF8"),
        deserialize=lambda obj: cPickle.loads(base64.b64decode(obj.encode("UTF8")))
):
    """
    A session factory function.  Creates a session class that saves its state in a
    postgres database.
    :param domain:
    :param path:
    :param secret: A secret string that is used to sign the session_id.
    :param cookie_name: The name of the cookie to set the session_id on.
    :param timeout: The number of seconds until the session expires.
    :param serialize: A callable function that is used to serialize the session for storage in the database.
    :param deserialize: A callable function that is used to deserialize the session in the database and return a object.
    """
    class PostgresSession(object):
        _cookie_name = cookie_name
        _secret = secret
        _path = path
        _domain = domain
        _timeout = timeout

        def __init__(self, request):
            super(PostgresSession, self).__init__()

            self._changed = False
            self._accessed = False
            self._session = None
            self._data = {}

            session_id = get_session_id(request, self._cookie_name, self._secret)

            self.request = request
            self.request.add_response_callback(self.response_callback)

            if session_id:
                session = self.request.dbsession.query(Session).filter(
                    Session.session_id == session_id
                ).first()
                if session:
                    # If the session has expired delete it.
                    if session.expires < datetime.datetime.now(datetime.timezone.utc):
                        request.dbsession.delete(session)
                    else:
                        self._session = session
                        self._data = deserialize(session.data)

        def save(self):
            """
            Save the current session state.
            :return:
            """
            if self._data:
                # Update the session in the database.
                if self._session is None:
                    # Session row does not exist, create it.
                    self._session = Session(session_id=generate_session_id())

                self._session.last_accessed = datetime.datetime.utcnow()
                self._session.expires = self._session.last_accessed + datetime.timedelta(seconds=self._timeout)
                self._session.data = serialize(self._data)
                self.request.dbsession.add(self._session)
            elif not self._data and self._session:
                # Delete the session from the database if the session is empty.
                self.request.dbsession.delete(self._session)
                self._session = None

        def invalidate(self):
            self._changed = True
            self._accessed = True
            self._data = {}

        def response_callback(self, request, response):
            """
            Callback method that runs after the response is returned.
            Makes sure that all information is saved to the database.
            :param request:
            :param response:
            :return:
            """
            if self._changed or self._accessed:
                request.tm.begin()
                self.save()
                session_id = self.session_id

                if session_id:
                    set_session_id(
                        response,
                        self._cookie_name,
                        self._secret,
                        self._session.session_id,
                        path=self._path,
                        domain=self._domain,
                        max_age=self._timeout
                    )
                elif self.request.cookies.get(self._cookie_name, None):
                    # if the cookie was set and their is no data delete the cookie.
                    response.delete_cookie(self._cookie_name, self._path, self._domain)

                print("here")
                request.tm.commit()

        @property
        def session_id(self):
            """Returns the saved session_id."""
            return self._session.session_id if self._session else None

        @property
        def signed_session_id(self):
            session_id = self.session_id
            return signed_serialize(session_id, secret) if session_id is not None else None

        @property
        def id(self):
            return self._session.id if self._session is not None else None

        def get_serialized_data(self):
            return serialize(self._data)

        def set_data_from_serialized(self, data):
            self._data = deserialize(data)

        def __getitem__(self, item):
            self._accessed = True
            return self._data[item]

        def __setitem__(self, key, value):
            self._changed = True
            self._accessed = True
            self._data[key] = value

        def __delitem__(self, key):
            self._changed = True
            self._accessed = True
            del self._data[key]

        def __iter__(self):
            return self._data.__iter__()

        def get(self, *args, **kwargs):
            self._accessed = True
            return self._data.get(*args, **kwargs)

        def pop(self, key, default=None):
            if key in self._data:
                self._accessed = True
                self._changed = True
                return self._data.pop(key, default)
            else:
                return default

        def update(self, *args, **kwargs):
            self._changed = True
            self._accessed = True
            self._data.update(*args, **kwargs)

        def setdefault(self, key, default=None):
            if key not in self._data:
                self._changed = True
                self._accessed = True
                return self._data.setdefault(key, default)
            else:
                return self._data[key]

        def clear(self):
            self._changed = True
            self._accessed = True
            return self._data.clear()

        def flash(self, msg, queue='', allow_duplicates=True):
            storage = self.setdefault('_f_'+queue, [])

            if allow_duplicates or msg not in storage:
                storage.append(msg)
                self._changed = True
                self._accessed = True

        def peek_flash(self, queue=""):
            return self.get('_f_'+queue, [])

        def pop_flash(self, queue=""):
            return self.pop("_f_"+queue, [])

    return PostgresSession
