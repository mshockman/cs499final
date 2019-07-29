from functools import wraps

from pyramid.httpexceptions import HTTPFound
from sqlalchemy.orm.exc import NoResultFound
from .models import User
import base64


def account_login_required(fn):
    @wraps(fn)
    def _wrapper(request, *args, **kwargs):
        if request.user is None:
            return HTTPFound(request.route_url("login"))

        return fn(request, *args, **kwargs)

    return _wrapper


def basic_auth_required(fn):
    @wraps(fn)
    def _wrapper(request, *args, **kwargs):
        authentication = request.headers.get('Authentication', None)

        if authentication:
            if not authentication.startswith("Basic "):
                request.response.status = 401

                return {
                    'error': "Authentication failed!"
                }

            auth_data = authentication[6:]

            try:
                username, password = base64.urlsafe_b64decode(auth_data).decode("UTF8").split(":")

                user = request.dbsession.query(User).filter(
                    User.email == username
                ).one()

                if user.is_password(password.encode("UTF8")):
                    return fn(request, *args, **kwargs)
            except (ValueError, NoResultFound):
                pass

        request.response.status = 401

        return {
            'error': 'Authentication failed!'
        }

    return _wrapper
