import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import SVGInline from 'react-svg-inline';
import Switch from 'react-switch';

import FileList from '../FileList/FileList';
import { toggleAutoComplete } from '../../redux/UI/UIActions';
import { getUIState } from '../../redux/UI/UIReducer';

import hamburgerIcon from '../../images/hamburger.svg';
import closeIcon from '../../images/closeButton.svg';
import styles from './SideBar.scss';

@connect(state => ({ autoComplete: getUIState(state).autoComplete }))
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
        const containerClasses = cx({
            [styles.sideBarShrunk]: shrunk,
            [styles.sideBarExpanded]: !shrunk,
        });
        // grrrrr . . .
        /* eslint-disable jsx-a11y/label-has-for */
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
                        <hr className={styles.separator} />
                        <FileList title="Files" titleClass={styles.fileListTitle} />
                    </div>
                )}
            </div>
        );
    }
}
