import React from 'react';

import styles from './FileNameInput.scss';

export default function FileNameInput(props) {
    const { fileName } = props;
    return (
        <input
            className={styles.fileNameInput}
            type="text"
            value={fileName}
        />
    );
}
