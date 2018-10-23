import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.processing.DebugExecutor import debugCode, executeDebugAction

class Debug:
    @acceptJSON('data')
    @returnJSON
    @withAuth
    def POST(self, data):
        code = data['code']
        return debugCode(code)


class DebugAction:
    @acceptJSON('data')
    @returnJSON
    @withAuth
    def POST(self, data):
        action = data['action']
        seshId = data['seshId']
        return executeDebugAction(seshId, action)


urls = (
    '', 'Debug',
    'debug_action/', 'DebugAction'
)

subapp = web.application(urls, locals())