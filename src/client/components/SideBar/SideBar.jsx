import React from 'react';
import cx from 'classnames';
import SVGInline from 'react-svg-inline';

import hamburgerIcon from '../../images/hamburger.svg';
import closeIcon from '../../images/closeButton.svg';
import styles from './SideBar.scss';


export default class SideBar extends React.Component {
    state = {
        shrunk: true,
    };

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
        return (
            <div
                className={containerClasses}
            >
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
        );
    }
}
