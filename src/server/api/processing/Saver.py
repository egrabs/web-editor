import uuid

from utils.MongoUtils import fileColl

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
                '$set': { 'contents': contents }
            }
        )


def saveNewFile(filename, contents, userId):
    file = {
        'filename': filename,
        'contents': contents,
        'owner': userId,
        '_id': str(uuid.uuid4())
    }
    fileColl.insert(file)