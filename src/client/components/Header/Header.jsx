import React from 'react';
import { connect } from 'react-redux';

import getHeader from './HeaderFactory';

import { getExecutionState } from '../../redux/Execution/ExecutionReducer';

// import styles from './Header.scss';

@connect(state => ({ debugMode: getExecutionState(state).debugMode }))
export default class Header extends React.Component {
    render() {
        const { debugMode } = this.props;
        const HeaderComponent = getHeader(debugMode);
        return <HeaderComponent />;
    }
}
