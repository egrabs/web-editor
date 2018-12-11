import React from 'react';
import cx from 'classnames';

import styles from './SexyButton.scss';

export default function SexyButton(props) {
    const {
        onClick,
        customClass,
        disable,
        text,
        children,
    } = props;
    const buttonClasses = cx(
        { [styles.disabled]: disable(), [styles.sexyButton]: !disable() },
        customClass,
    );
    return (
        <div className={styles.container}>
            <button
                disabled={disable()}
                onClick={onClick}
                className={buttonClasses}
                type="button"
            >
                {text || children}
            </button>
        </div>
    );
}
SexyButton.defaultProps = {
    customClass: '',
    disable: () => false,
};
