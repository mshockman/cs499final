from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.renderers import render_to_response
from final499.accounts.models import User


class AuthenticationViews(object):
    def __init__(self, request):
        self.request = request

    @view_config(route_name="login", request_method="GET")
    def login_page(self, **kwargs):
        return render_to_response("../templates/login.jinja2", {**kwargs}, self.request)

    @view_config(route_name="logout")
    def logout(self):
        self.request.session.invalidate()
        return HTTPFound(self.request.route_url("login"))

    @view_config(route_name="login", request_method="POST")
    def login_user(self):
        db = self.request.dbsession
        user = db.query(User).filter(User.email == self.request.POST['email']).first()

        if user and user.is_password(self.request.POST['password'].encode("UTF8")):
            self.request.session['user_id'] = user.id
            if "next" in self.request.GET:
                return HTTPFound(self.request.GET['next'])
            else:
                return HTTPFound("/")
        else:
            return self.login_page(
                error="Login Failed! Email or Password was incorrect!"
            )
