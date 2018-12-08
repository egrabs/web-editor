import web
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.Saver import saveFile
from utils.EndpointDecorators import acceptJSON, returnJSON, withAuth

class Save(BaseEndpoint):
    @acceptJSON('data')
    @returnJSON
    @withAuth(checkAuth=True, requireUserContext=True)
    def POST(self, data, userid=None):
        filename = data['filename']
        contents = data['contents']
        saveFile(filename, contents, userid)
        # this needs error handling but first I
        # gotta flesh out what the error cases are
        # TODO
        return { 'filename': filename }

urls = (
    '', 'Save'
)

subapp = web.application(urls, locals())