# lol . . . real hardcore security
def validateCode(code):
    if 'import' in code:
        raise ValueError('No import statement allowed.')