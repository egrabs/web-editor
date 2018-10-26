import os

import uuid

from utils.StreamRedirectors import redirectStdOut
import utils.DebugSessionCache as debugCache
from utils.ValidateCode import validateCode
import utils.ProcDebugger as procDebug
import subprocess as sp
import threading as thrd
import StringIO
from Queue import Queue, Empty

def accumOutput(stdout, queue):
    # idk why this is necessary but dear lord dont remove it
    queue.put('')
    while True:
        line = stdout.readline()
        queue.put(line)

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

    output = ''
    while True:
        output = proc.stdout.readline()
        if output.startswith('->'):
            break

    keew = Queue()
    accumThread = thrd.Thread(target=accumOutput, args=(proc.stdout, keew))
    accumThread.start()

    return {
        'seshId': debugCache.cacheSession(proc, accumThread, keew, filename),
        'result': output
     }


# TODO: delete file when debug session is over
def executeDebugAction(id, action):
    procConfig = debugCache.getSession(id)
    proc = procConfig['proc']
    queue = procConfig['outputQueue']
    proc.stdin.write('{}\n'.format(action))
    proc.stdin.flush()
    result = StringIO.StringIO()
    tries = 0
    while True:
        try:
            result.write(queue.get(timeout=0.1))
        except Empty:
            tries += 1
            if tries == 2:
                break
    if action == 'quit':
        accumThread = procConfig['accumThread']
        accumThread.terminate()
        filename = procConfig['filename']
        os.remove(filename)
    return { 'result': result.getvalue() }

# TODO: this should wrap the user's code in an exec
# so that we can pass it what globals and locals we want
# instead of their script having access to everything
def preProcessCode(code):
    return 'import pdb\npdb.set_trace()\n{}'.format(code)
