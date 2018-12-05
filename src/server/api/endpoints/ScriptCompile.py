import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.ScriptCompiler import compileScript

class ScriptCompile(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth()
    def POST(self, data):
        code = data['code']
        return compileScript(code)

urls = (
    '', 'ScriptCompile'
)

subapp = web.application(urls, locals())