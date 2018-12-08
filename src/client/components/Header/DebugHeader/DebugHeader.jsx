/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';
import cx from 'classnames';

import request from '../../../utils/requests';
import { setDebugOutput, stopDebugMode } from '../../../redux/Execution/ExecutionActions';
import { getExecutionState } from '../../../redux/Execution/ExecutionReducer';

import styles from './DebugHeader.scss';

import curvedArrow from '../../../images/curvedArrow.svg';
import closeCross from '../../../images/closeButton.svg';
import downArrow from '../../../images/downArrow.svg';

@connect(state => ({ seshId: getExecutionState(state).debugSeshId }))
export default class DebugHeader extends React.Component {
    get debugOptions() {
        const { dispatch } = this.props;
        return [
            {
                src: curvedArrow,
                action: 'next',
                title: 'step over',
            },
            {
                src: downArrow,
                action: 'step',
                title: 'step into',
                additionalClass: styles.downArrow,
            },
            {
                src: closeCross,
                action: 'quit',
                title: 'quit',
                additionalAction: () => dispatch(stopDebugMode()),
            },
        ];
    }

    makeDebugActionRequest = (action, additionalAction) => {
        const { seshId, dispatch } = this.props;
        request('POST', 'debug/debug_action/')
            .body({
                seshId,
                action,
            })
            .then(res => res.json())
            .then(({ result, err }) => {
                if (err) {
                    if (err.type === 'sessionExpired') {
                        window.alert(err.content);
                        dispatch(stopDebugMode());
                    }
                }
                dispatch(setDebugOutput(result));
                if (additionalAction) additionalAction();
            });
    };

    render() {
        return (
            <div className={styles.header}>
                {this.debugOptions.map(({
                    action,
                    additionalAction,
                    src,
                    additionalClass,
                    title,
                }) => {
                    const onClick = () => this.makeDebugActionRequest(action, additionalAction);
                    const cName = cx(styles.debugIcon, additionalClass);
                    return (
                        <span title={title} className={styles.svgContainer}>
                            <SVGInline
                                className={cName}
                                onClick={onClick}
                                svg={src}
                            />
                        </span>
                    );
                })}
            </div>
        );
    }
}
