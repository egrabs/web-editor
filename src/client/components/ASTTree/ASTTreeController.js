/* eslint-disable no-param-reassign */

import * as d3 from 'd3';

function processAst(ast) {
    if (ast.body) {
        ast.children = ast.body;
    }
    ast.body.forEach(chld => processAst(chld));
}

export default function ASTTreeController(props) {
    const { svgElem, ast } = props;
    const svg = d3.select(svgElem);

    const transformed = processAst(ast);

    const hier = d3.hierarchy(transformed);

    console.log(hier);

    return svg;
}
