import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.LoginValidator import validateLogin, register, InvalidLogin, UserExists

class Login:
    @acceptJSON('data')
    @returnJSON
    # haha lol . . . uyyy TODO
    @withAuth(checkAuth=False)
    def POST(self, data):
        username = data.get('username', '')
        password = data.get('password', '')
        try:
            return {
                'token': validateLogin(username, password)
            }
        except InvalidLogin:
            return {
                'err': True
            }

class Register:
    @acceptJSON('data')
    @returnJSON
    @withAuth(checkAuth=False)
    def POST(self, data):
        username = data.get('username', '')
        password = data.get('password', '')
        email = data.get('email', '')
        try:
            return {
                'token': register(username, password, email)
            }
        except UserExists:
            return {
                'err': 'user_exists'
            }


urls = (
    '', 'Login',
    'register/', 'Register'
)

subapp = web.application(urls, locals())