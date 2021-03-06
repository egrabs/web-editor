import uuid

import time

_cache = {}

def cacheSession(proc, accumThread, outputQueue, lock, filename):
    seshId = str(uuid.uuid4())
    _cache[seshId] = {
        'proc': proc,
        'accumThread': accumThread,
        'outputQueue': outputQueue,
        'queueLock': lock,
        'filename': filename,
        'lastInteraction': time.time(),
        'expired': False
    }
    return seshId

def getSession(seshId):
    sesh = _cache.get(seshId)
    if sesh is not None:
        sesh['lastInteraction'] = time.time()
    return sesh

def getAllSessionIds():
    return _cache.keys()

def hasSession(seshId):
    return seshId in _cache

def isSessionExpired(seshId):
    sesh = _cache.get(seshId)
    return sesh is None or sesh['expired']

def unmountSession(seshId):
    del _cache[id]