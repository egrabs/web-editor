import React from 'react';
import cx from 'classnames';

import styles from './AccordionWrap.scss';

export default function accordionWrap(Component) {
    return class extends React.Component {
        state = {
            expanded: false,
        };

        toggleExpanded = () => {
            this.setState(prevState => ({ expanded: !prevState.expanded }));
        };

        renderAccordionBar = () => {
            const { title, titleClass } = this.props;
            const { expanded } = this.state;
            const arrowClass = cx({ [styles.downArrow]: !expanded, [styles.upArrow]: expanded });
            return (
                <div
                    className={cx(titleClass, styles.accordionBar)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Tab') {
                            this.toggleExpanded();
                        }
                    }}
                    onClick={this.toggleExpanded}
                >
                    {title}
                    <span className={arrowClass} />
                </div>
            );
        };

        render() {
            const { expanded } = this.state;
            return (
                <div className={styles.accordionContainer}>
                    {this.renderAccordionBar()}
                    {expanded && <Component {...this.props} />}
                </div>
            );
        }
    };
}
