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
        hangLeft: false,
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
        const { label, downArrow, buttonContents } = this.props;
        if (buttonContents) return buttonContents;
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
        return menuItems.filter(item => !item.hidden || !item.hidden())
            .map(item => (
                <li
                    role="presentation"
                    className={cx(styles.listItem, itemClass)}
                    onClick={() => {
                        item.onClick();
                        this.setState({ expanded: false });
                    }}
                    key={item.label}
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
            hangLeft,
        } = this.props;

        const dropDownBaseClass = cx({
            [styles.dropDownLeft]: hangLeft,
            [styles.dropDownRight]: !hangLeft,
        });
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
                        className={cx(dropDownBaseClass, dropDownClass)}
                        role="menu"
                    >
                        {this.renderDropdownContents()}
                    </ul>
                )}
            </div>
        );
    }
}
