import os

import uuid

import multiprocessing as mp
from utils.StreamRedirectors import redirectStdOut
import utils.DebugSessionCache as debugCache
from utils.ValidateCode import validateCode
import utils.ProcDebugger as procDebug
import subprocess as sp

def debugCode(code):
    validateCode(code)

    code = preProcessCode(code)

    masterPipe, slavePipe = mp.Pipe(duplex=True)
    
    debugObj = procDebug.ForkedPdb()

    # eventually override stuff like "__builtins__"
    # so that the user's code can't do any damage
    globes = {}

    # loked out
    lokes = { 'pdb': debugObj }

    filename = '{}.py'.format(str(uuid.uuid4()))

    with open(filename, 'w') as fh:
        fh.write(code)    
    proc = sp.Popen(['python', filename], stdout=sp.PIPE, stderr=sp.PIPE, stdin=sp.PIPE)

    return { 'seshId': debugCache.cacheSession(proc) }

# TODO: delete file when debug session is over

def executeDebugAction(id, action):
    # with redirectStdOut() as streams:
    proc = debugCache.getSession(id)
    stdout, stdin = proc.communicate('{}\n'.format(action))
    return { 'result': stdout }


def preProcessCode(code):
    return 'import pdb\npdb.set_trace()\n{}'.format(code)

def _debugCode(code, pipe, globes, lokes):
    exec(code, globes, lokes)