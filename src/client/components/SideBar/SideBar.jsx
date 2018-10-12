import React from 'react';
import cx from 'classnames';
import SVGInline from 'react-svg-inline';

import hamburgerIcon from '../../images/hamburger.svg';
import styles from './SideBar.scss';

// <button
//     type="button"
//     onClick={this.toggleShrinkState}
//     style={{ width: '100%' }}
// >

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
                <SVGInline
                    className={styles.hamburgerButton}
                    onClick={this.toggleShrinkState}
                    svg={hamburgerIcon}
                />
            </div>
        );
    }
}
