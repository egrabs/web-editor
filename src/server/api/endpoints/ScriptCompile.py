import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.ScriptCompiler import compileScript

class ScriptCompile:
    @acceptJSON('data')
    @returnJSON
    @withAuth
    def POST(self, data):
        code = data['code']
        return compileScript(code)

urls = (
    '', 'ScriptCompile'
)

subapp = web.application(urls, locals())