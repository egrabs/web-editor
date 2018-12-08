import React from 'react';
import { connect } from 'react-redux';

import { getUIState } from '../../redux/UI/UIReducer';

import styles from './NotificationContainer.scss';


@connect(state => ({ executing: getUIState(state).executing }))
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
