import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth

class Execute:
    @acceptJSON('data')
    @returnJSON
    @withAuth
    def POST(self, data):
        with redirectStdOut() as sb:
            code = data['code']
            try:
                validateCode(code)
                exec(code)
                return { 'executionOutput': sb.getvalue() }
            except ValueError as ve:
                return { 'error': ve.message }

urls = (
    '', 'Execute'
)

subapp = web.application(urls, locals())
