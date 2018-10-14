import web
import json

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
    def _returnJSON(self, *args, **kwargs):
        retVal = endpoint(self, *args, **kwargs)
        return json.dumps(retVal)
    return _returnJSON