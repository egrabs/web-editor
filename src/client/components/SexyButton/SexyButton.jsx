import React from 'react';
import cx from 'classnames';

import styles from './SexyButton.scss';

export default function SexyButton(props) {
    const {
        onClick,
        text,
        customClass,
    } = props;
    const buttonClasses = cx(styles.sexyButton, customClass);
    return (
        <div className={styles.container}>
            <button
                onClick={onClick}
                className={buttonClasses}
                type="button"
            >
                {text}
            </button>
        </div>
    );
}
SexyButton.defaultProps = {
    customClass: '',
};
