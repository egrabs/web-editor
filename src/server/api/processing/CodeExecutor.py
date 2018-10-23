import multiprocessing as mp
import sys

from utils.StreamRedirectors import redirectStdOut
from utils.ValidateCode import validateCode
import traceback as tb

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

    proc = mp.Process(target=_execCode, args=(code, sendPipe))
    proc.start()

    # would use proc.join(PROCESS_TIMEOUT)
    # but then we won't know if the process timed out or not
    # and can't raise a Timeout Exception
    if listenPipe.poll(PROCESS_TIMEOUT):
        return { 'executionResults': listenPipe.recv() }
    else:
        if proc.is_alive():
            proc.terminate()
        raise Timeout()

# TODO: restrict this process so it can't do harm
# may have to use POpen or even a docker container
# don't let it read/write to filesystem, make network requests or otherwise
# mess with the host machine
def _execCode(code, pipe):
    with redirectStdOut() as streams:
        stdout = streams['out']
        stderr = streams['err']
        try:
            exec(code)
        except Exception as e:
            pass
        finally:
            is_exc = sys.exc_info() != (None, None, None)
            exc = tb.format_exc() if is_exc else ''
            err = (
                {
                    'type': 'code_error',
                    'content': stderr.getvalue()
                }
                if stderr.getvalue()
                else None
            )
            pipe.send({
                'out': stdout.getvalue(),
                'err': err,
                'exc': exc
            })

