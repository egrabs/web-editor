import os
import json
import jwt
import datetime

SECRET_FILE = 'utils/security/jwt_secret.json'

NUM_BYTES = 16

class SecurityError(Exception):
    pass

def _jwtSecret():
    if os.path.exists(SECRET_FILE):
        with open(SECRET_FILE, 'r') as fh:
            crypto = json.load(fh)
            return crypto['secret']
    else:
        secretBytes = os.urandom(NUM_BYTES)
        crypto = { 'secret': secretBytes.encode('base64') }
        with open(SECRET_FILE, 'w') as fh:
            json.dump(crypto, fh)
        return crypto['secret']

def getToken():
    token = jwt.encode(
        { 'exp': datetime.datetime.now() + datetime.timedelta(days=7) },
        _jwtSecret(),
        algorithm='HS256'
    )
    return token

def validateToken(token):
    if not token:
        raise SecurityError
    try:
        decoded = jwt.decode(token, _jwtSecret(), algorithms='HS256')
    except jwt.ExpiredSignatureError:
        raise SecurityError
    # TOOD