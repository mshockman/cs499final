from .models import User


def get_user(request):
    user_id = request.session.get("user_id", None)
    if user_id is not None:
        return request.dbsession.query(User).filter(User.id == user_id).first()
    else:
        return None


def includeme(config):
    config.add_request_method(get_user, 'user', reify=True)
