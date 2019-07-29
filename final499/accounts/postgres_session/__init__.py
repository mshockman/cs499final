from .session import postgres_session_factory
from .models import Session


def includeme(config):
    config.set_session_factory(postgres_session_factory("testsecret"))
