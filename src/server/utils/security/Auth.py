import os
import json
import jwt
import datetime
import hashlib as hl

SECRET_FILE = 'utils/security/jwt_secret.json'
NUM_BYTES = 16
_SALT = '\xcaA\x92\xa8\xca\xa0\xb5\xab68\xc5\xe9\x16\xfb\xd7\x13'
_ROUNDS = 100000

class SecurityError(Exception):
    pass

def hashPwd(password):
    return hl.pbkdf2_hmac('sha256', password, _SALT, _ROUNDS)

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

def validateToken(rawToken):
    if not rawToken:
        raise SecurityError
    _, token = getUsernameAndToken(rawToken)
    try:
        decoded = jwt.decode(token, _jwtSecret(), algorithms='HS256')
    except jwt.ExpiredSignatureError:
        raise SecurityError

def getUsernameAndToken(rawToken):
    bearer, b64str = rawToken.split(' ')
    username, token = b64str.decode('base64').split(':')
    return username, token

