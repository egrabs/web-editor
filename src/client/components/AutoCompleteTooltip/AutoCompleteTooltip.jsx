import React from 'react';
import cx from 'classnames';

import styles from './AutoCompleteTooltip.scss';

const LEFT_SPACING = 10;
const TOP_SPACING = 10;

export default function AutoCompleteTooltip(props) {
    const {
        selectedSuggestion,
        suggestions,
        top,
        left,
    } = props;

    if (!suggestions) {
        return null;
    }

    return (
        <div
            id={styles.autoCompleteTooltip}
            style={{ top: top + TOP_SPACING, left: left + LEFT_SPACING }}
        >
            {suggestions.map((sugg) => {
                const spanClass = cx(
                    styles.suggestionHolder,
                    { [styles.selected]: selectedSuggestion === sugg },
                );
                return (
                    <span key={sugg} className={spanClass}>
                        {sugg}
                    </span>
                );
            })}
        </div>

    );
}
