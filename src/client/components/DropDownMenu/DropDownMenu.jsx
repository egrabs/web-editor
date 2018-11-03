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

    containerRef = React.createRef();

    state = {
        expanded: false,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.wasClickInsideMe);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.wasClickInsideMe);
    }

    toggleExpanded = () => {
        this.setState(prevState => ({
            expanded: !prevState.expanded,
        }));
    };

    /**
    * Close the dropdown if it's open and the user clicks
    * somewhere outside our dropdown
    */
    wasClickInsideMe = (event) => {
        const { current } = this.containerRef;
        if (!current.contains(event.target)) {
            this.setState({ expanded: false });
        }
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
            <div
                className={cx(styles.dropDownContainer, className)}
                ref={this.containerRef}
            >
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
