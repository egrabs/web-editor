/* eslint-disable max-len */
/* eslint-disable no-param-reassign, no-debugger, no-confusing-arrow, no-unused-vars, no-underscore-dangle */
import * as d3 from 'd3';

/**
* Returns new objects all the way down because the ast
* object comes from redux state and is therefore immutable
*/
function processAst(ast) {
    const { body, ...rest } = ast;
    const newObj = { ...rest };
    if (body && body.length > 0) {
        newObj.children = body.map(chld => processAst(chld));
    }
    return newObj;
}

const margin = {
    top: 10,
    right: 120,
    bottom: 10,
    left: 40,
};

const diagonal = d3.linkVertical().x(d => d.x).y(d => d.y);

export default function ASTTreeController(props) {
    const { svgElem: { current }, ast } = props;
    const svg = d3.select(current);

    const transformed = processAst(ast);

    console.log(transformed);

    const root = d3.hierarchy(transformed, d => d.children);

    const { width, height } = svg.node().getBoundingClientRect();

    const effectiveWidth = width - 20;
    const effectiveHeight = height - 20;

    const tree = d3.tree().size([effectiveWidth, effectiveHeight]);

    root.x = width / 2;
    root.y = 10;
    root.descendants().forEach((d, i) => {
        d.id = i;
        // d._children = d.children;
        // if (d.depth && d.data._type.length !== 7) d.children = null;
    });

    svg // .attr('viewBox', [-margin.left, -margin.top, width, height])
        .style('font', '10px sans-serif')
        .style('user-select', 'none');

    const gLink = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5);

    const gNode = svg.append('g');
    // .attr('cursor', 'pointer');

    function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        // const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg.transition()
            .duration(duration)
            // .attr('height', height)
            // .attr('viewBox', [-margin.left, left.x - margin.top, width, height])
            .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

        // Update the nodes…
        const node = gNode.selectAll('g')
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0);
            // .on('click', (d) => {
            //     d.children = d.children ? null : d._children;
            //     update(d);
            // });

        nodeEnter.append('circle')
            .attr('r', 2.5)
            .attr('fill', d => d._children ? '#555' : '#999');

        nodeEnter.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => d._children ? -6 : 6)
            .attr('text-anchor', d => d._children ? 'end' : 'start')
            .text(d => d.data._type)
            .clone(true)
            .lower()
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 3)
            .attr('stroke', 'white');

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1);

        // Transition exiting nodes to the parent's new position.
        // const nodeExit = node.exit().transition(transition).remove()
        //     .attr('transform', d => `translate(${source.x},${source.y})`)
        //     .attr('fill-opacity', 0)
        //     .attr('stroke-opacity', 0);

        // Update the links…
        const link = gLink.selectAll('path')
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append('path')
            .attr('d', diagonal);
            // .attr('d', (d) => {
            //     const o = { x: source.x0, y: source.y0 };
            //     return diagonal({ source: o, target: o });
            // });

        // Transition links to their new position.
        // link.merge(linkEnter).transition(transition)

        // Transition exiting nodes to the parent's new position.
        // link.exit().transition(transition).remove()
        //     .attr('d', (d) => {
        //         const o = { x: source.x, y: source.y };
        //         return diagonal({ source: o, target: o });
        //     });

        // Stash the old positions for transition.
        root.eachBefore((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    update(root);

    return svg.node();
}
