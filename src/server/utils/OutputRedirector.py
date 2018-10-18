import sys
import StringIO
import contextlib

@contextlib.contextmanager
def redirectStdOut(stdout=None, stderr=None):
    oldstdout = sys.stdout
    oldstderr = sys.stderr
    if stdout is None:
        stdout = StringIO.StringIO()
    if stderr is None:
        stderr = StringIO.StringIO()
    # THESE ARE REDIRECTING STDOUT AND STDERR TO String IO
    # WHENEVER THIS CONTEXT HANDLER IS ACTIVE YOU WILL NOT SEE
    # ANY PRINT STATEMENTS OR ANY UNHANDLED EXCEPTIONS. BEWARE
    sys.stdout = stdout
    sys.stderr = stderr
    yield {
        'out': stdout,
        'err': stderr,
        'testPrint': lambda s: oldstdout.write(str(s) + '\n')
    }
    # restore system stdout to its old value before the context manager closes
    sys.stdout = oldstdout
    sys.stderr = oldstderr