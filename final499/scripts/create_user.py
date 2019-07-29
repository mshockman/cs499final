import os
import sys
import transaction

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from final499.models import (
    get_engine,
    get_session_factory,
    get_tm_session
    )

from final499.accounts.models import User


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        config_uri = input("Config URI: ")
    else:
        config_uri = argv[1]

    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    dbsession = get_tm_session(session_factory, transaction.manager)

    first_name = input("First Name: ")
    last_name = input("Last Name: ")
    email = input("Email: ")

    while True:
        password = input("Password: ")
        confirm_password = input("Confirm Password: ")

        if password != confirm_password:
            print("Password and confirm password did not match.")
        else:
            break

    with transaction.manager:
        user = User()
        user.first_name = first_name
        user.last_name = last_name
        user.set_password(password)
        user.email = email
        dbsession.add(user)


if __name__ == "__main__":
    main()
