import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.CodeExecutor import execCode, Timeout

class Execute:
    @acceptJSON('data')
    @returnJSON
    @withAuth()
    def POST(self, data):
        code = data['code']
        mode = data['mode']
        try:
            return execCode(code, mode)
        except Timeout as te:
            return { 
                'executionResults': {
                    'err': {
                        'type': 'timeout',
                        'content': str(te)
                    }
                }
            }
        except Exception as e:
            # TODO: log the error before re-raising

            # server 500s here, we don't know what happened
            # unexpected error
            raise e

urls = (
    '', 'Execute'
)

subapp = web.application(urls, locals())
