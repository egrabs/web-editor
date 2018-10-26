import uuid

_cache = {}

def cacheSession(proc, accumThread, outputQueue, filename):
    seshId = str(uuid.uuid4())
    _cache[seshId] = {
        'proc': proc,
        'accumThread': accumThread,
        'outputQueue': outputQueue,
        'filename': filename
    }
    return seshId

def getSession(seshId):
    return _cache.get(seshId)

def hasSession(seshId):
    return seshId in _cache

def unmountSession(seshId):
    del _cache[id]