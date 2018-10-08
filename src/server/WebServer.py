import web
import json
from utils.OutputRedirector import redirectStdOut
from utils.ValidateCode import validateCode
# import pdb


class execute:
    def POST(self):
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')
        with redirectStdOut() as sb:
            data = json.loads(web.data())
            code = data['code']
            try:
                validateCode(code)
                exec(code)
                return json.dumps({ 'executionOutput': sb.getvalue() })
            except ValueError as ve:
                return json.dumps({ 'error': ve.message })

urls = (
    '/execute/', 'execute'
)

if __name__ == "__main__": 
    app = web.application(urls, globals())
    app.run()