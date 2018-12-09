import web

import api.endpoints.ScriptAnalyze as ScriptAnalyze
import api.endpoints.Execute as Execute
import api.endpoints.Debug as Debug
import api.endpoints.ScriptCompile as ScriptCompile
import api.endpoints.Login as Login
import api.endpoints.Save as Save
import api.endpoints.Files as Files

from utils.DebugSessionCleanUp import startCleanUpThread


urls = (
    '/execute', Execute.subapp,
    '/analyze', ScriptAnalyze.subapp,
    '/debug', Debug.subapp,
    '/compile', ScriptCompile.subapp,
    '/login', Login.subapp,
    '/files', Files.subapp
)

app = web.application(urls, locals())

if __name__ == "__main__":
    cleanUpThread = startCleanUpThread()
    app.run()