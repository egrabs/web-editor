import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import SVGInline from 'react-svg-inline';
import Switch from 'react-switch';

import { toggleAutoComplete } from '../../redux/RootActions';

import hamburgerIcon from '../../images/hamburger.svg';
import closeIcon from '../../images/closeButton.svg';
import styles from './SideBar.scss';

/* eslint-disable */

@connect(state => ({ autoComplete: state.autoComplete }))
export default class SideBar extends React.Component {
    state = {
        shrunk: true,
    };

    get sideBarItems() {
        const { dispatch, autoComplete } = this.props;
        return [
            {
                label: 'Auto Complete',
                onClick: () => dispatch(toggleAutoComplete),
                on: autoComplete,
            },
        ];
    }

    toggleShrinkState = () => {
        this.setState(prevState => ({
            shrunk: !prevState.shrunk,
        }));
    };

    render() {
        const { shrunk } = this.state;
        const { dispatch } = this.props;
        const containerClasses = cx({
            [styles.sideBarShrunk]: shrunk,
            [styles.sideBarExpanded]: !shrunk,
        });
        return (
            <div className={containerClasses}>
                <div className={styles.iconContainer}>
                    {shrunk && (
                        <SVGInline
                            className={styles.hamburgerButton}
                            onClick={this.toggleShrinkState}
                            svg={hamburgerIcon}
                        />
                    )}
                    {!shrunk && (
                        <SVGInline
                            className={styles.closeButton}
                            onClick={this.toggleShrinkState}
                            svg={closeIcon}
                        />
                    )}
                </div>
                {!shrunk && (
                    <div>
                        {this.sideBarItems.map((sbi, idx) => (
                            <label htmlFor={`sbi-${idx}`}>
                                <Switch
                                    height={15}
                                    width={30}
                                    className={styles.toggleSwitch}
                                    onChange={sbi.onClick}
                                    checked={sbi.on}
                                    id={`sbi-${idx}`}
                                />
                                <span className={styles.sideBarItemLabel}>{sbi.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}
