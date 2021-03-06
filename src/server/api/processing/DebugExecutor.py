import os
import sys
import uuid

from utils.StreamRedirectors import redirectStdOut
import utils.DebugSessionCache as debugCache
from utils.ValidateCode import validateCode
import subprocess as sp
import multiprocessing as mp
from threading import Lock
import StringIO
from Queue import Queue, Empty

def accumOutput(stdout, queue, lock):
    while True:
        line = stdout.readline()
        if line and not line.startswith('(Pdb) >'):
            lock.acquire()
            queue.put(line)
            lock.release()

def debugCode(code):
    validateCode(code)

    code = preProcessCode(code)

    # eventually override stuff like "__builtins__"
    # so that the user's code can't do any damage
    globes = {}

    # loked out
    lokes = {}

    filename = '{}.py'.format(str(uuid.uuid4()))

    with open(filename, 'w') as fh:
        fh.write(code)

    proc = sp.Popen(['python', '-u', filename], stdout=sp.PIPE, stdin=sp.PIPE)

    startCollecting = False
    output = ''
    while True:
        output = proc.stdout.readline()
        if output.startswith('->'):
            break
    lochness = Lock()
    manager = mp.Manager()
    keew = manager.Queue()
    accumThread = mp.Process(target=accumOutput, args=(proc.stdout, keew, lochness))
    accumThread.daemon = True
    accumThread.start()

    return {
        'seshId': debugCache.cacheSession(proc, accumThread, keew, lochness, filename),
        'result': output
     }

class SessionExpired(Exception):
    def __init__(self, id):
        self.seshId = id

    def __repr__(self):
        return '{} was accessed but is expired'.format(self.seshId)

    def __str__(self):
        return (
            'That session is no longer running because' +
            'it was not interacted with for over 10 minutes.' +
            '\nPlease start a new debugging session.'
        )


# TODO: delete file when debug session is over
def executeDebugAction(id, action):
    if debugCache.isSessionExpired(id):
        raise SessionExpired(id)
    procConfig = debugCache.getSession(id)
    proc = procConfig['proc']
    if action == 'quit':
        accumThread = procConfig['accumThread']
        accumThread.terminate()
        proc.terminate()
        filename = procConfig['filename']
        os.remove(filename)
        return {}
    proc.stdin.write('{}\n'.format(action))
    proc.stdin.flush()
    result = StringIO.StringIO()
    queue = procConfig['outputQueue']
    lock = procConfig['queueLock']
    while queue.qsize() < 1:
        pass
    lock.acquire()
    while queue.qsize() > 0:
        # additional try / except because qsize is approximate
        try:
            item = queue.get(block=True, timeout=0.1)
            result.write(item)
        except Empty:
            pass
    lock.release()
    return { 'result': result.getvalue() }

# TODO: this should wrap the user's code in an exec
# so that we can pass it what globals and locals we want
# instead of their script having access to everything
def preProcessCode(code):
    return 'import pdb\npdb.set_trace()\n{}'.format(code)
