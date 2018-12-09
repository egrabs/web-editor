import web
from utils.EndpointDecorators import returnJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.FileService import getFiles

class Files(BaseEndpoint):
    @returnJSON
    @withAuth(requireUserContext=True)
    def GET(self, userid):
        return getFiles(userid)

urls = (
    '', 'Files'
)

subapp = web.application(urls, locals())