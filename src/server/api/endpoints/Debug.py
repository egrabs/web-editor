import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.DebugExecutor import debugCode, executeDebugAction, SessionExpired

class Debug(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth()
    def POST(self, data):
        code = data['code']
        return debugCode(code)


class DebugAction(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth()
    def POST(self, data):
        action = data['action']
        seshId = data['seshId']
        try:
            return executeDebugAction(seshId, action)
        except SessionExpired as se:
            return {
                'err': {
                    'type': 'sessionExpired',
                    'content': str(se)
                }
            }



urls = (
    '', 'Debug',
    '/debug_action', 'DebugAction'
)

subapp = web.application(urls, locals())