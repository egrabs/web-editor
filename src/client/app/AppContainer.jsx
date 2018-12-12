import React from 'react';

import SideBar from '../components/SideBar/SideBar';
import CenterContainer from '../components/CenterContainer/CenterContainer';
import RightGutter from '../components/RightGutter/RightGutter';
import NotificationContainer from '../components/NotificationContainer/NotificationContainer';

import styles from './AppContainer.scss';

export default function AppContainer() {
    return (
        <div className={styles.appContainer}>
            <SideBar />
            <CenterContainer />
            <RightGutter />
            <NotificationContainer />
        </div>

    );
}
