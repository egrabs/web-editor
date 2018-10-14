import web
import json
from utils.OutputRedirector import redirectStdOut
from utils.ValidateCode import validateCode
import api.ScriptAnalyzer as ScriptAnalyzer
import api.Execute as Execute

urls = (
    '/execute/', Execute.subapp,
    '/analyze/', ScriptAnalyzer.subapp
)

app = web.application(urls, locals())

if __name__ == "__main__": 
    app.run()