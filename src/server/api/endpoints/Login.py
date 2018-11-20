import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.LoginValidator import validateLogin, InvalidLogin

class Login:
    @acceptJSON('data')
    @returnJSON
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
    pass

urls = (
    '', 'Login',
)

subapp = web.application(urls, locals())