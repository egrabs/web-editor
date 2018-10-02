import web
import json
from utils.OutputRedirector import redirectStdOut
# import pdb

class execute:
    def POST(self):
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')
        with redirectStdOut() as sb:
            data = json.loads(web.data())
            code = data['code']
            exec(code)
        return json.dumps({'executionOutput': sb.getvalue()})

urls = (
    '/execute/', 'execute'
)

if __name__ == "__main__": 
    app = web.application(urls, globals())
    app.run()