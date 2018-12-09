import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.LoginValidator import (
    validateLogin, register,
    InvalidLogin, UserExists,
    validateLoginFromToken
)

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

class TokenLogin(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth(checkAuth=False)
    def POST(self, data):
        token = data['token']
        # if token validation ends up failing with an exception that's ok
        # we want the server to 500 in that case, the frontend will catch the error
        # and do the right thing . . . hence no try/except
        return validateLoginFromToken(token)

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
    '/token', 'TokenLogin',
    '/register', 'Register'
)

subapp = web.application(urls, locals())