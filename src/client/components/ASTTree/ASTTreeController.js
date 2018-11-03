/* eslint-disable max-len */
/* eslint-disable no-param-reassign, no-debugger, no-confusing-arrow, no-underscore-dangle */
import * as d3 from 'd3';

/**
* Returns new objects all the way down because the ast
* object comes from redux state and is therefore immutable
*/
function processAst(ast) {
    // TODO: body isn't the only special value that should be interpreted as children
    const {
        body,
        value,
        ...rest
    } = ast;
    const newObj = { ...rest };
    newObj.children = [];
    if (body && body.length > 0) {
        newObj.children = body.map(chld => processAst(chld));
    }
    if (value) {
        const { func, args } = value;
        if (func) {
            newObj.children.push(func);
            if (args) {
                args.forEach(a => newObj.children.push(a));
            }
        }
    }
    return newObj;
}

function buildNodeSummary(data) {
    const text = [data.id || data.n || data._type];
    // TODO: handle all possible data properties
    if (data.values) text.push(`values: ${data.values.map(v => v.s).join(',')}`);
    // if (data.func) text.push(`function: ${data.func.id}()`);
    if (data.args) {
        if (data.args.args.length > 0) text.push(`args: ${data.args.args.map(a => a.id).join(',')}`);
    }
    return text;
}

/**
* Now this is confusing
*
*/
function buildNodeText(textElems) {
    const yDisp = 12;
    textElems.each(function (el) {
        const textLines = buildNodeSummary(el.data);
        textLines.forEach((tl, idx) => {
            d3.select(this)
                .append('tspan')
                .attr('y', idx * yDisp)
                .attr('x', 8)
                .text(tl);
        });
    });
}

const margin = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
};

const diagonal = d3.linkVertical().x(d => d.x).y(d => d.y);

export default function ASTTreeController(props) {
    const { svgElem: { current }, ast } = props;
    const svg = d3.select(current);

    const transformed = processAst(ast);

    console.log(transformed);

    const root = d3.hierarchy(transformed, d => d.children);

    const { width, height } = svg.node().getBoundingClientRect();

    const effectiveWidth = width - margin.left - margin.right;
    const effectiveHeight = height - margin.top - margin.bottom;

    const tree = d3.tree().size([effectiveWidth, effectiveHeight]);

    root.x = width / 2;
    root.y = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
    });

    svg.style('font', '10px sans-serif')
        .style('user-select', 'none');

    const gNode = svg.append('g')
        .attr('transform', `translate(0,${margin.top})`);

    const gLink = svg.append('g')
        .attr('transform', `translate(0,${margin.bottom})`)
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5);

    function update() {
        const nodes = root.descendants();
        const links = root.links();

        tree(root);

        const node = gNode.selectAll('g')
            .data(nodes, d => d.id);

        const nodeEnter = node.enter().append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1);

        nodeEnter.append('circle')
            .attr('r', 2.5)
            .attr('fill', '#999');

        nodeEnter.append('text')
            .attr('dy', '0.31em')
            .attr('x', 6)
            .attr('text-anchor', 'start')
            .call(buildNodeText);

        const link = gLink.selectAll('path')
            .data(links, d => d.target.id);

        link.enter().append('path')
            .attr('d', diagonal);
    }

    update(root);
}
