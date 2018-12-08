import web
import json
import uuid
import bson
from utils.security.Auth import validateToken, getUserIdAndToken

def acceptJSON(*args):
    def _acceptJSON(endpoint):
        if len(args) == 0:
            def wrapper1(self):
                received = web.data()
                as_json = json.loads(received)
                return endpoint(self, as_json)
            return wrapper1
        if len(args) == 1:
            def wrapper2(self):
                received = web.data()
                as_json = json.loads(received)
                return endpoint(self, **{args[0]: as_json})
            return wrapper2
        else:
            def wrapper3(self):
                kwargs = {}
                for arg in args:
                    if arg in as_json:
                        kwargs[arg] = as_json[arg];
                    else:
                        # TODO
                        raise ValueError("")
                return endpoint(self, **kwargs)
            return wrapper3
    return _acceptJSON

def returnJSON(endpoint):
    def _returnJSON(*args, **kwargs):
        retVal = endpoint(*args, **kwargs)
        return json.dumps(retVal, cls=CustomJSONEncoder)
    return _returnJSON

def withAuth(checkAuth=True, requireUserContext=False):
    def decorator(endpoint):
        def _withAuth(*args, **kwargs):
            web.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
            web.header('Access-Control-Allow-Origin', 'http://localhost:8080')
            web.header("Access-Control-Allow-Credentials", "true")
            token = web.ctx.env.get('HTTP_AUTHORIZATION')
            if requireUserContext:
                userid, _ = getUserIdAndToken(token)
                kwargs['userid'] = userid
            if checkAuth:
                validateToken(token)
            return endpoint(*args, **kwargs)
        return _withAuth
    return decorator

# if this gets really big it should go in its own file
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if type(o) == uuid.UUID:
            return str(o)
        if type(o) == bson.objectid.ObjectId:
            return str(o)
        return json.JSONEncoder.default(self, o)
