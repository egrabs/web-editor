import uuid

_cache = {}

def cacheSession(proc):
    seshId = str(uuid.uuid4())
    _cache[seshId] = proc
    return seshId

def getSession(seshId):
    return _cache.get(seshId)

def hasSession(seshId):
    return seshId in _cache

def unmountSession(seshId):
    del _cache[id]