/* eslint-disable react/prefer-stateless-function */

import React from 'react';

import CodeEditor from '../CodeEditor/CodeEditor';

import styles from './CenterContainer.scss';

export default class CenterContainer extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    Header
                </div>
                <div className={styles.body}>
                    <CodeEditor />
                </div>
            </div>
        );
    }
}
