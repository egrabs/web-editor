import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.CodeExecutor import execCode, Timeout
from utils.OutputRedirector import redirectStdOut

class Execute:
    @acceptJSON('data')
    @returnJSON
    @withAuth
    def POST(self, data):
        code = data['code']
        try:
            res = execCode(code)
            print res
            return res
        except ValueError as ve:
            # ok I mean really the server should just 500 in this case tbh
            # TODO
            return {
                'executionResults': {
                    'error': {
                        'type': 'server_error',
                        'content': str(ce)
                    }
                }
            }
        except Timeout as te:
            return { 
                'executionResults': {
                    'error': {
                        'type': 'timeout',
                        'content': str(te)
                    }
                }
            }

urls = (
    '', 'Execute'
)

subapp = web.application(urls, locals())
