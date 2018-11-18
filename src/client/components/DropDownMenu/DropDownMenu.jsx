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
        menuItems: [],
        downArrow: true,
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

    renderButtonContents = () => {
        const { label, downArrow } = this.props;
        return (
            <div className={styles.buttonContents}>
                <span>{label}</span>
                {downArrow && (
                    <span className={styles.arrowContainer}>
                        <span className={styles.downArrow} />
                    </span>
                )}
            </div>
        );
    };

    renderDefaultDropdownContents = () => {
        const {
            menuItems,
            itemClass,
        } = this.props;
        return menuItems.map(item => (
            <li
                role="presentation"
                className={cx(styles.listItem, itemClass)}
                onClick={() => {
                    item.onClick();
                    this.setState({ expanded: false });
                }}
            >
                {item.label}
                {item.selected && item.selected() && (
                    <SVGInline
                        className={styles.checkMark}
                        svg={checkMark}
                    />
                )}
            </li>
        ));
    }

    renderDropdownContents = () => {
        const { children } = this.props;
        console.log(children);
        if (children) {
            return children;
        }
        return this.renderDefaultDropdownContents();
    }

    render() {
        const { expanded } = this.state;
        const {
            className,
            buttonClass,
            dropDownClass,
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
                    {this.renderButtonContents()}
                </button>
                {expanded && (
                    <ul
                        className={cx(styles.dropDown, dropDownClass)}
                        role="menu"
                    >
                        {this.renderDropdownContents()}
                    </ul>
                )}
            </div>
        );
    }
}
