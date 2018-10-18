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

def execCode(code):
    validateCode(code)  # raises ValueError

    listenPipe, sendPipe = mp.Pipe(duplex=False)

    with redirectStdOut() as outputChannels:

        proc = mp.Process(target=_execCode, args=(code, sendPipe, outputChannels))
        proc.start()

        if listenPipe.poll(PROCESS_TIMEOUT):
            execResults = listenPipe.recv()
            while proc.is_alive():
                pass
            tp = outputChannels['testPrint']
            tp(outputChannels['err'].getvalue())
        elif proc.is_alive():
            proc.terminate()
            tp = outputChannels['testPrint']
            tp(outputChannels['err'].getvalue())
            raise Timeout
        else:
            while proc.is_alive():
                pass
            tp = outputChannels['testPrint']
            tp(outputChannels['err'].getvalue())
            # try again? maybe it ended just when our timeout hit
            if listenPipe.poll():
                execResults = listenPipe.recv()
            else:
                raise Timeout

        if 'err' in execResults:
            # unfortunate but in the error case we have to wait
            # for the error to raise and the process to die
            tp = outputChannels['testPrint']
            tp(proc.is_alive())
            while proc.is_alive():
                pass

            tp('ssst')
            tp(outputChannels['err'].getvalue())
            tp(outputChannels['out'].getvalue())
            return {
                'executionResults': {
                    'error': {
                        'type': 'code_error',
                        'content': outputChannels['err'].getvalue()
                    },
                    'output': execResults['out']
                }
            }
        else:
            return {
                'executionResults': {
                    'output': execResults['out']
                }
            }


def _execCode(code, pipe, outputChannels):
    stdout = outputChannels['out']
    stderr = outputChannels['err']
    # try:
    exec(code)
    # except Exception as e:
    #     pipe.send({ 'err': True, 'out': stdout.getvalue() })
    #     raise e

    pipe.send({ 'out': stdout.getvalue() })
