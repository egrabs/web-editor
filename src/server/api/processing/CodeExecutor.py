import multiprocessing as mp
import time

from utils.OutputRedirector import redirectStdOut
from utils.ValidateCode import validateCode

import pdb

# TODO: one day this should use a pool of worker processes instead of 
# going ahead and creating a process without first checking how many
# are already running

PROCESS_TIMEOUT = 10  # seconds

class Timeout(Exception):
    def __repr__(self):
        return 'Process timed out. Ran longer than {} seconds'.format(PROCESS_TIMEOUT)

    def __str__(self):
        return self.__repr__()

class CodeError(Exception):
    def __init__(self, msg):
        self.msg = msg

    def __repr__(self):
        return self.msg

    def __str__(self):
        return self.msg

def execCode(code):
    # pdb.set_trace()
    validateCode(code)

    listenPipe, sendPipe = mp.Pipe(duplex=False)

    proc = mp.Process(target=_execCode, args=(code, sendPipe))
    proc.start()

    if listenPipe.poll(PROCESS_TIMEOUT):
        execResults = listenPipe.recv()
    elif proc.is_alive():
        proc.terminate()
        raise Timeout
    else:
        # try again? maybe it ended just when our timeout hit
        if listenPipe.poll():
            execResults = listenPipe.recv()
        else:
            raise Timeout

    # possibly error should just be returned along with
    # the stdout in this case? I think if the user's code
    # throws an unhandled error though that's that. . . 
    # I guess they'd still want to see whatever printed if anything
    # before the error hit
    # TODO
    if 'err' in execResults:
        raise CodeError(execResults['out'])
    else:
        return execResults['out']


def _execCode(code, pipe):
    with redirectStdOut() as sb:
        stdout = sb['out']
        stderr = sb['err']
        try:
            exec(code)
        except Exception as e:
            pipe.send({
                'out': stdout.getvalue(),
                'err': str(e)
            })
        pipe.send({ 'out': stdout.getvalue() })
