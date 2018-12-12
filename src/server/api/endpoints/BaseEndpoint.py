import web


class BaseEndpoint:
    def OPTIONS(self):
        web.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')
        web.header("Access-Control-Allow-Credentials", "true")
        web.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS")
        return