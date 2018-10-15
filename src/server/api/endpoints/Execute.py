import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.CodeExecutor import execCode, Timeout, CodeError
from utils.OutputRedirector import redirectStdOut

class Execute:
    @acceptJSON('data')
    @returnJSON
    @withAuth
    def POST(self, data):
        code = data['code']
        try:
            out = execCode(code)
            return { 'executionOutput': out }
        except CodeError as ce:
            return { 'codeError': str(ce) }
        except ValueError as ve:
            return { 'error': str(ve) }
        except Timeout as te:
            return { 'error': str(te) }

urls = (
    '', 'Execute'
)

subapp = web.application(urls, locals())
