import ast

def compileScript(code):
    rootNode = ast.parse(code)
    tree = dump(rootNode, annotate_fields=False, include_attributes=True)
    return { 'ast': rootNode }