import uuid
from datetime import datetime

from utils.MongoUtils import fileColl

def getFiles(userId):
    files = fileColl.find({ 'owner': userId })
    return { 'files': list(files) }

def renameFile(userId, oldname, newname):
    # TODO: validate filenames via some sorta regex
    file = fileColl.update(
        { 
            'owner': userId,
            'filename': oldname
        },
        {
            '$set': {
                'filename': newname,
                'last_modified': datetime.utcnow()
            }
        },
        upsert=False
    )
    return { 'filename': newname }

def saveFile(filename, contents, userId):
    file = fileColl.find_one({
        'filename': filename,
        'owner': userId
    })
    if not file:
        saveNewFile(filename, contents, userId)
    else:
        fileColl.update(
            {
                'filename': filename,
                'owner': userId
            },
            {
                '$set': {
                    'contents': contents,
                    'last_modified': datetime.utcnow()
                }
            }
        )


def saveNewFile(filename, contents, userId):
    time = datetime.utcnow()
    file = {
        'filename': filename,
        'created': time,
        'last_modified': time,
        'contents': contents,
        'owner': userId,
        '_id': str(uuid.uuid4())
    }
    fileColl.insert(file)
