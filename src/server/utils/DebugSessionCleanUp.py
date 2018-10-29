import time
import os

from utils.DebugSessionCache import getAllSessionIds, _cache, isSessionExpired

import multiprocessing as mp

PROCESS_EXPIRY_LIMIT = 10  # 10 mins

RUN_EVERY = 10  # 5 mins

def _cleanSessions(cache):
    while True:
        time.sleep(RUN_EVERY)
        killed = []
        for seshId in getAllSessionIds():
            if isSessionExpired(seshId):
                continue
            session = cache[seshId]
            lastInteraction = session['lastInteraction']
            if time.time() - lastInteraction >= PROCESS_EXPIRY_LIMIT:
                session['proc'].terminate()
                session['accumThread'].terminate()
                fname = session['filename']
                if os.path.exists(fname):
                    os.remove(fname)
                session['expired'] = True
                killed.append(seshId)
        if len(killed) > 0:
            # this should be logged, not 'printed'
            # but we'd have to have logging set up for that
            print 'Killed Debug Threads:'
            for victim in killed:
                print victim

def startCleanUpThread():
    cleanUpThread = mp.Process(target=_cleanSessions, args=(_cache,))
    cleanUpThread.start()
    return cleanUpThread