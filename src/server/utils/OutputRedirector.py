import sys
import StringIO
import contextlib

@contextlib.contextmanager
def redirectStdOut(stdout=None):
    oldstdout = sys.stdout
    if stdout is None:
        stdout = StringIO.StringIO()
    sys.stdout = stdout
    yield stdout
    # restore system stdout to its old value before the context manager closes
    sys.stdout = oldstdout