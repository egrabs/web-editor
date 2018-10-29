import time
import os

from utils.DebugSessionCache import getAllSessionIds, getSession, isSessionExpired

import threading as thrd

PROCESS_EXPIRY_LIMIT = 600  # 10 mins in seconds

RUN_EVERY = 300  # 5 mins

def _cleanSessions():
    time.sleep(RUN_EVERY)
    killed = []
    for seshId in getAllSessionIds():
        if isSessionExpired(seshId):
            continue
        session = getSession(seshId)
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
        print 'Killed Debug Threads:'
        for victim in killed:
            print victim

def startCleanUpThread():
    cleanUpThread = thrd.Thread(target=_cleanSessions)
    cleanUpThread.start()
    return cleanUpThread