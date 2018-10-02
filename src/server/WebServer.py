import web
import json
# import pdb

class execute:
    def POST(self):
        data = json.loads(web.data())
        code = data['code']
        exec(code)

urls = (
    '/execute/', 'execute'
)

if __name__ == "__main__": 
    app = web.application(urls, globals())
    app.run()    