
from utils.MongoUtils import fileColl

def getFiles(userId):
    files = fileColl.find({ 'owner': userId })
    return { 'files': list(files) }