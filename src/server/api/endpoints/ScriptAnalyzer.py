import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth

class ScriptStats:
    @acceptJSON('json_blob')
    @returnJSON
    @withAuth
    def POST(self, json_blob):
        code = json_blob['code']
        # trivial stats to test endpoint wrappers for now
        return { 'codeLength': len(code) }

urls = (
    '', 'ScriptStats'
)

subapp = web.application(urls, locals())
