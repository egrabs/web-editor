import web
import json
import uuid

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

# once we have user log-in this will handle authorization headers
# it's also going to handle misc headers -- and that'll be its sole
# job for now
def withAuth(endpoint):
    def _withAuth(*args, **kwargs):
        # TODO: origin url should come from request headers
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')
        return endpoint(*args, **kwargs)
    return _withAuth

# if this gets really big it should go in its own file
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if type(o) == uuid.UUID:
            return str(o)
        return json.JSONEncoder.default(self, o)
