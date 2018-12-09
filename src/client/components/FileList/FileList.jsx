import React from 'react';
import { connect } from 'react-redux';

import { getFileSystemState } from '../../redux/FileSystem/FileSystemReducer';
import { setCurrentFile } from '../../redux/FileSystem/FileSystemActions';
import accordionWrap from '../HigherOrder/AccordionWrap/AccordionWrap';

import styles from './FileList.scss';

function FileList(props) {
    const { files, dispatch } = props;

    const onFileClick = (file) => { dispatch(setCurrentFile(file)); };

    return (
        <div className={styles.fileList}>
            {files.map(file => (
                <div
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onFileClick(file);
                        }
                    }}
                    onClick={() => onFileClick(file)}
                    className={styles.fileName}
                >
                    {file.filename}
                </div>
            ))}
        </div>
    );
}

const mapStateToProps = state => ({ files: getFileSystemState(state).files });

export default accordionWrap(connect(mapStateToProps)(FileList), 'Files');
