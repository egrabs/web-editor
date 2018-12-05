import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.LoginValidator import validateLogin, register, InvalidLogin, UserExists

class Login(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth(checkAuth=False)
    def POST(self, data):
        username = data.get('username', '')
        password = data.get('password', '')
        try:
            return validateLogin(username, password)
        except InvalidLogin:
            return {
                'err': True
            }

class Register(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth(checkAuth=False)
    def POST(self, data):
        username = data.get('username', '')
        password = data.get('password', '')
        email = data.get('email', '')
        try:
            return register(username, password, email)
        except UserExists:
            return {
                'err': 'user_exists'
            }


urls = (
    '', 'Login',
    'register/', 'Register'
)

subapp = web.application(urls, locals())