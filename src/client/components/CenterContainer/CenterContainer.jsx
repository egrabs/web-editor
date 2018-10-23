/* eslint-disable react/prefer-stateless-function */

import React from 'react';

import CodeEditor from '../CodeEditor/CodeEditor';
import Header from '../Header/Header';

import styles from './CenterContainer.scss';

export default class CenterContainer extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.body}>
                    <CodeEditor />
                </div>
            </div>
        );
    }
}
