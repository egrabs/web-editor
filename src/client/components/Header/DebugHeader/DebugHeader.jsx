/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';
import cx from 'classnames';

import request from '../../../utils/requests';
import { setDebugOutput } from '../../../redux/RootActions';

import styles from './DebugHeader.scss';

import curvedArrow from '../../../images/curvedArrow.svg';
import closeCross from '../../../images/closeButton.svg';
import downArrow from '../../../images/downArrow.svg';

@connect(state => ({ seshId: state.debugSeshId }))
export default class DebugHeader extends React.Component {
    get debugOptions() {
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
            },
        ];
    }

    makeDebugActionRequest = (action) => {
        const { seshId, dispatch } = this.props;
        request('POST', 'debug/debug_action/')
            .body({
                seshId,
                action,
            })
            .then(res => res.json())
            .then(({ result }) => {
                dispatch(setDebugOutput(result));
            });
    };

    render() {
        return (
            <div className={styles.header}>
                {this.debugOptions.map(({
                    action,
                    src,
                    additionalClass,
                    title,
                }) => {
                    const onClick = () => this.makeDebugActionRequest(action);
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
