import web
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.Saver import saveFile

class Save(BaseEndpoint):
    @withAuth(checkAuth=True, requireUserContext=True)
    def POST(self, data, user=None):
        filename = data['filename']
        contents = data['contents']
        saveFile(filename, contents, user)
        # this needs error handling but first I
        # gotta flesh out what the error cases are
        # TODO
        return { 'filename': filename }

urls = (
    '', 'Save'
)

subapp = web.application(urls, locals())