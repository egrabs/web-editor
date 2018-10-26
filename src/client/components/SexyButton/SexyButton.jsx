import React from 'react';
import cx from 'classnames';

import styles from './SexyButton.scss';

export default function SexyButton(props) {
    const {
        onClick,
        text,
        customClass,
        disable,
    } = props;
    const buttonClasses = cx(styles.sexyButton, customClass);
    return (
        <div className={styles.container}>
            <button
                disabled={disable()}
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
