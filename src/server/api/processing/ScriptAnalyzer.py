import ast
from utils.Dictionaries import dictset
from collections import defaultdict

def analyzeScript(code):
    rootNode = ast.parse(code)
    scriptReaper = StatisticsVisitor()
    scriptReaper.visit(rootNode)
    print scriptReaper.stats
    return 'meh'


class StatisticsVisitor(ast.NodeVisitor):
    def __init__(self):
        self.stats = defaultdict(lambda: 0)
        self.names = set()

    def visit_Num(self, node):
        self.stats['nums'] += 1

    def visit_Name(self, node):
        self.names.add(node.id)
        self.stats['name_encountered'] += 1

    def visit_BinOp(self, node):
        pass


    def visit_Assign(self, node):
        self.stats['assignments'] += 1

    # def generic_visit(self, node):
    #     import pdb
    #     pdb.set_trace()