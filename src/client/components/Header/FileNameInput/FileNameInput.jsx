import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

import { renameFile } from '../../../redux/FileSystem/FileSystemActions';
import { getFileSystemState } from '../../../redux/FileSystem/FileSystemReducer';

import styles from './FileNameInput.scss';

import closeIcon from '../../../images/closeButton.svg';
import checkMark from '../../../images/checkMark.svg';

@connect(state => ({ filename: getFileSystemState(state).filename }))
export default class FileNameInput extends React.Component {
    container = React.createRef();

    input = React.createRef();

    constructor(props) {
        super(props);
        const { filename } = this.props;
        this.state = {
            modifiedFileName: filename,
            focused: false,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.wasClickInsideMe);
    }

    componentDidUpdate(prevProps) {
        const { filename } = this.props;
        if (filename !== prevProps.filename) {
            /* eslint-disable */
            this.setState({
                modifiedFileName: filename,
            });
            /* eslint-enable */
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.wasClickInsideMe);
    }

    wasClickInsideMe = (event) => {
        const { current } = this.container;
        if (!current.contains(event.target)) {
            this.setState({ focused: false });
        }
    };

    focusInput = () => {
        const { current } = this.input;
        current.focus();
    };

    onCancel = (e) => {
        // don't let the event bubble to the containing div or it'll cause the
        // whole thing to be re-focused
        e.stopPropagation();
        const { filename } = this.props;
        this.setState({ modifiedFileName: filename, focused: false });
    };

    onSave = (e) => {
        e.stopPropagation();
        const { modifiedFileName } = this.state;
        const { dispatch, filename } = this.props;
        this.setState({ focused: false });
        if (filename !== modifiedFileName) dispatch(renameFile(filename, modifiedFileName));
    };

    render() {
        const { modifiedFileName, focused } = this.state;
        /* eslint-disable */
        return (
            <div
                className={styles.fileNameContainer}
                ref={this.container}
                onClick={() => {
                    this.focusInput();
                    this.setState({ focused: true });
                }}
            >
                <input
                    className={styles.fileNameInput}
                    ref={this.input}
                    onChange={(e) => {
                        this.setState({ modifiedFileName: e.currentTarget.value });
                    }}
                    type="text"
                    value={modifiedFileName}
                />
                {focused && (
                    <div className={styles.iconContainer}>
                        <SVGInline
                            svg={closeIcon}
                            className={styles.fileButton}
                            onClick={this.onCancel}
                        />
                        <SVGInline
                            svg={checkMark}
                            className={styles.fileButton}
                            onClick={this.onSave}
                        />
                    </div>
                )}
            </div>
        );
    }
}
