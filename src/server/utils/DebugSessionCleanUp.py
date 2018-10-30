import time
import os

from utils.DebugSessionCache import getAllSessionIds, _cache, isSessionExpired

import threading as thrd

PROCESS_EXPIRY_LIMIT = 600  # 10 mins

RUN_EVERY = 300  # 5 mins

# could this cause a race condition?
# if _cleanSessions has only partially executed when the OS decides to
# let a different thread run for a bit, could a user request to /debugAction
# end up grabbing a cached session that's been halfway cleaned?
# maybe its processes have been terminated but it hasn't set expired=True yet?
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
    cleanUpThread = thrd.Thread(target=_cleanSessions, args=(_cache,))
    cleanUpThread.start()
    return cleanUpThread