import pymongo
from config.serverconfig import serverConfig


mongoClient = pymongo.MongoClient(serverConfig.get('mongo_host'), serverConfig.get('mongo_port'))

database = mongoClient[serverConfig.get('database_name')]

userColl = database['users']

fileColl = database['files']