import React from 'react';
import { connect } from 'react-redux';

import ASTController from './ASTTreeController';
import SVGContainer from '../SVGContainer/SVGContainer';

@connect(state => ({ ast: state.astJson }))
export default class ASTTree extends React.Component {
    render() {
        const { ast } = this.props;
        return <SVGContainer ast={ast} controller={ASTController} />;
    }
}
