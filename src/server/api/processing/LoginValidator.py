import hashlib as hl

from utils.MongoUtils import userColl

_salt = '\xcaA\x92\xa8\xca\xa0\xb5\xab68\xc5\xe9\x16\xfb\xd7\x13'
rounds = 100000

class InvalidLogin(Exception):
    pass

def _hashPwd(password):
    return hl.pbkdf2_hmac('sha256', password, _salt, rounds)

def _generateToken():
    # TODO
    return 'hehe Im a fake token'

def validateLogin(username, password):
    user = userColl.find_one({ 'username': username })
    if not user:
        raise InvalidLogin()
    pwdHash = _hashPwd(password)
    if user['pwdhash'] != pwdHash:
        raise InvalidLogin()
    return _generateToken()


