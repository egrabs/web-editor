import React from 'react';

import styles from './SVGContainer.scss';

export default class SVGContainer extends React.Component {
    svg = React.createRef();

    componentDidMount() {
        this.executeSVGController();
    }

    componentDidUpdate() {
        this.executeSVGController();
    }

    executeSVGController = () => {
        const { controller } = this.props;
        controller({
            svgElem: this.svg,
            ...this.props,
        });
    };

    render() {
        return (
            <div className={styles.svgContainer}>
                <svg className={styles.svg} ref={this.svg} />
            </div>
        );
    }
}
