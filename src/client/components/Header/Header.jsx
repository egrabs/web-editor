import React from 'react';
import { connect } from 'react-redux';

import SexyButton from '../SexyButton/SexyButton';
import request from '../../utils/requests';

import styles from './Header.scss';


@connect(state => ({
    debugMode: state.debugMode,
    seshId: state.debugSeshId,
}))
export default class Header extends React.Component {
    makeDebugActionRequest = () => {
        const { seshId } = this.props;
        request('POST', 'debug/debug_action/')
            .body({
                seshId,
                action: 'next',
            })
            .then(res => res.json())
            .then((res) => { console.log('huzzah', res); });
    }

    render() {
        const { debugMode } = this.props;
        return (
            <div className={styles.header}>
                {debugMode && (
                    <SexyButton
                        onClick={this.makeDebugActionRequest}
                        text="next"
                    />
                )}
            </div>
        );
    }
}
