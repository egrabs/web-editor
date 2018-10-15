import web

import api.endpoints.ScriptAnalyzer as ScriptAnalyzer
import api.endpoints.Execute as Execute

urls = (
    '/execute/', Execute.subapp,
    '/analyze/', ScriptAnalyzer.subapp
)

app = web.application(urls, locals())

if __name__ == "__main__": 
    app.run()