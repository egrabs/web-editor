import React from 'react';
import SVGInline from 'react-svg-inline';
import cx from 'classnames';

import styles from './DropDownMenu.scss';

import checkMark from '../../images/checkMark.svg';

export default class DropDownMenu extends React.Component {
    static defaultProps = {
        className: '',
        dropDownClass: '',
        buttonClass: '',
        itemClass: '',
    };

    state = {
        expanded: false,
    };

    toggleExpanded = () => {
        this.setState(prevState => ({
            expanded: !prevState.expanded,
        }));
    };

    render() {
        const { expanded } = this.state;
        const {
            menuItems,
            className,
            dropDownClass,
            buttonClass,
            itemClass,
            label,
        } = this.props;

        return (
            <div className={cx(styles.dropDownContainer, className)}>
                <button
                    type="button"
                    className={cx(styles.dropDownButton, buttonClass)}
                    onClick={this.toggleExpanded}
                >
                    {label}
                    <span className={styles.downArrow} />
                </button>
                {expanded && (
                    <ul
                        className={cx(styles.dropDown, dropDownClass)}
                        role="menu"

                    >
                        {menuItems.map(item => (
                            <li
                                role="presentation"
                                className={cx(styles.listItem, itemClass)}
                                onClick={() => {
                                    item.onClick();
                                    this.setState({ expanded: false });
                                }}
                            >
                                {item.label}
                                {item.selected() && (
                                    <SVGInline
                                        className={styles.checkMark}
                                        svg={checkMark}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}
