import React from 'react';

import styles from './SVGContainer.scss';

export default class SVGContainer extends React.Component {
    svgId = 'component-svg';

    componentDidMount() {
        this.executeSVGController();
    }

    componentDidUpdate() {
        this.executeSVGController();
    }

    executeSVGController = () => {
        const { controller } = this.props;
        controller({
            svgElem: document.getElementById(this.svgId),
            ...this.props,
        });
    };

    render() {
        return (
            <div className={styles.svgContainer}>
                <svg id={this.svgId} />
            </div>
        );
    }
}
