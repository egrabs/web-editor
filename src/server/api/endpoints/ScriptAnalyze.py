import web
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.ScriptAnalyzer import analyzeScript

class ScriptStats(BaseEndpoint):
    @acceptJSON('json_blob')
    @returnJSON
    @withAuth()
    def POST(self, json_blob):
        code = json_blob['code']
        return { 'codeLength': analyzeScript(code) }

urls = (
    '', 'ScriptStats'
)

subapp = web.application(urls, locals())
