import web

import api.endpoints.ScriptAnalyze as ScriptAnalyze
import api.endpoints.Execute as Execute

urls = (
    '/execute/', Execute.subapp,
    '/analyze/', ScriptAnalyze.subapp
)

app = web.application(urls, locals())

if __name__ == "__main__": 
    app.run()