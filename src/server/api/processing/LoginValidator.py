import bson
import uuid

from utils.MongoUtils import userColl
from utils.security.Auth import getToken, hashPwd, getUserIdAndToken, validateToken

class InvalidLogin(Exception):
    pass

class UserExists(Exception):
    pass

def validateLogin(username, password):
    user = userColl.find_one({ 'username': username })
    pwdHash = hashPwd(password)
    if not user or str(user['pwdhash']) != pwdHash:
        raise InvalidLogin()
    return {
        'token': getToken(),
        'username': username,
        'email': user['email'],
        'userid': user['_id'],
    }

def validateLoginFromToken(rawToken):
    validateToken(rawToken)
    userId, token = getUserIdAndToken(rawToken)
    user = userColl.find_one({ '_id': userId })
    if not user:
        raise InvalidLogin()
    # go ahead and set the frontend up with a new token
    newToken = getToken()
    return {
        'token': newToken,
        'username': user['username'],
        'email': user['email'],
        'userid': user['_id']
    }


def register(username, password, email):
    user = userColl.find_one({ 'username': username })
    if user:
        raise UserExists()
    # TODO: validate username, password & email w/ regexes
    pwdHash = hashPwd(password)
    user = {
        'username': username,
        'pwdhash': bson.Binary(pwdHash),
        'email': email,
        '_id': str(uuid.uuid4())
    }
    userColl.insert_one(user)
    return {
        'token': getToken(),
        'username': username,
        'email': user['email'],
        'userid': user['_id']
    }
