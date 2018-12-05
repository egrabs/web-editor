import web
from api.endpoints.BaseEndpoint import BaseEndpoint

class Save(BaseEndpoint):
    @withAuth()
    def POST(self, data, user):
        pass
        # filename = data['filename']
        # filecontents = data['filecontents']

urls = (
    '', 'Save'
)

subapp = web.application(urls, locals())