import React from 'react';
import cx from 'classnames';

import styles from './SideBar.scss';

export default class SideBar extends React.Component {
    state = {
        shrunk: false,
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
                <button
                    type="button"
                    onClick={this.toggleShrinkState}
                    style={{ width: '100%' }}
                >
                    {shrunk ? 'expand' : 'collapse'}
                </button>
            </div>
        );
    }
}
