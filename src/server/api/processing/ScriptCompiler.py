import ast
import json
from ast2json import ast2json

def compileScript(code):
    rootNode = ast.parse(code)
    return { 'ast': ast2json(rootNode) }