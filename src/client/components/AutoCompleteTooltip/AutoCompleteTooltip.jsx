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

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div
            id={styles.autoCompleteTooltip}
            style={{ top: top + TOP_SPACING, left: left + LEFT_SPACING }}
        >
            {suggestions.map((sugg) => {
                const suggestionClass = cx(
                    styles.suggestionHolder,
                    { [styles.selected]: selectedSuggestion.all === sugg.all },
                );
                return (
                    <div key={sugg.all} className={suggestionClass}>
                        <span className={styles.typed}>
                            {sugg.typed}
                        </span>
                        <span className={styles.remaining}>
                            {sugg.remaining}
                        </span>
                    </div>
                );
            })}
        </div>

    );
}
