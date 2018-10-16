import React from 'react';

import styles from './ButtonBar.scss';

import SexyButton from '../SexyButton/SexyButton';

export default function ButtonBar(props) {
    const { buttons } = props;

    return (
        <div className={styles.btnContainer}>
            {buttons.map((btn) => {
                const { reactKey, ...rest } = btn;
                return <SexyButton key={reactKey} {...rest} />;
            })}
        </div>
    );
}
