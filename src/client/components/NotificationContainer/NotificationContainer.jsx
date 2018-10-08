import React from 'react';
import { connect } from 'react-redux';
import styles from './NotificationContainer.scss';

@connect(state => ({ executing: state.executing }))
export default class NotificationContainer extends React.Component {
    render() {
        const { executing } = this.props;
        return (
            <div
                className={executing ? styles.ldsRipple : styles.kill}
            >
                <div />
                <div />
            </div>
        );
    }
}
