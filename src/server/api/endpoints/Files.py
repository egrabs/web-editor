import web
from utils.EndpointDecorators import returnJSON, acceptJSON, withAuth
from api.endpoints.BaseEndpoint import BaseEndpoint
from api.processing.FileService import getFiles, renameFile, saveFile, createNewFile


class Files(BaseEndpoint):
    @returnJSON
    @withAuth(requireUserContext=True)
    def GET(self, userid):
        return getFiles(userid)


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

    @returnJSON
    @withAuth(requireUserContext=True)
    def PUT(self, userid=None):
        return createNewFile(userid)


class Rename(BaseEndpoint):
    @returnJSON
    @acceptJSON('data')
    @withAuth(requireUserContext=True)
    def POST(self, data, userid):
        oldname = data['oldname']
        newname = data['newname']
        return renameFile(userid, oldname=oldname, newname=newname)

urls = (
    '', 'Files',
    '/save', 'Save',
    '/rename', 'Rename'
)

subapp = web.application(urls, locals())