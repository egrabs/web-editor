import React from 'react';

import request from '../../utils/requests';
import accordionWrap from '../HigherOrder/AccordionWrap/AccordionWrap';

import styles from './FileList.scss';

class FileList extends React.Component {
    state = {
        files: [],
        loaded: false,
    };

    componentDidMount() {
        request('GET', '/files')
            .body({})
            .then(res => res.json())
            .then((res) => {
                const { files } = res;
                this.setState({
                    loaded: true,
                    files,
                });
            });
    }

    render() {
        const { loaded, files } = this.state;
        if (!loaded) return null;

        return (
            <div className={styles.fileList}>
                {files.map(file => (
                    <div className={styles.fileName}>
                        {file.filename}
                    </div>
                ))}
            </div>
        );
    }
}

export default accordionWrap(FileList, 'Files');
