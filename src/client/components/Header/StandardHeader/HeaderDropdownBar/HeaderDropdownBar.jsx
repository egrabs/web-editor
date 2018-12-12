import React from 'react';
import { connect } from 'react-redux';

import DropDownMenu from '../../../DropDownMenu/DropDownMenu';
import { setEditorMode, setEditorTheme } from '../../../../redux/UI/UIActions';
import { loadFiles, newFile } from '../../../../redux/FileSystem/FileSystemActions';
import { getUIState } from '../../../../redux/UI/UIReducer';
import { getAuthState } from '../../../../redux/Auth/AuthReducer';
import { getFileSystemState } from '../../../../redux/FileSystem/FileSystemReducer';
import request from '../../../../utils/requests';

import styles from './HeaderDropdownBar.scss';

const mapStateToProps = (state) => {
    const { editorMode, editorTheme } = getUIState(state);
    const { userCode, filename } = getFileSystemState(state);
    const { authed } = getAuthState(state);
    return {
        editorMode,
        editorTheme,
        authed,
        userCode,
        filename,
    };
};

@connect(mapStateToProps)
export default class HeaderDropdownBar extends React.Component {
    saveCurrentFile = () => {
        const { userCode, filename, dispatch } = this.props;
        request('POST', '/files/save')
            .body({
                filename,
                contents: userCode,
            })
            .then(() => dispatch(loadFiles()));
    };

    createNewFile = () => {
        const { dispatch } = this.props;
        dispatch(newFile());
    };

    render() {
        const {
            dispatch,
            authed,
            editorMode,
            editorTheme,
        } = this.props;
        return (
            <div className={styles.container}>
                <DropDownMenu
                    label="File"
                    className={styles.dropdownTab}
                    menuItems={[
                        {
                            label: 'save',
                            onClick: this.saveCurrentFile,
                            hidden: () => !authed,
                        },
                        {
                            label: 'new',
                            onClick: this.createNewFile,
                        },
                    ]}
                />
                <DropDownMenu
                    label="Language"
                    className={styles.dropdownTab}
                    menuItems={[
                        {
                            label: 'Python',
                            onClick: () => dispatch(setEditorMode('python')),
                            selected: () => editorMode === 'python',
                        },
                        {
                            label: 'JavaScript',
                            onClick: () => dispatch(setEditorMode('javascript')),
                            selected: () => editorMode === 'javascript',
                        },
                    ]}
                />
                <DropDownMenu
                    label="Theme"
                    className={styles.dropdownTab}
                    menuItems={[
                        {
                            label: 'Dark',
                            onClick: () => dispatch(setEditorTheme('3024-night')),
                            selected: () => editorTheme === '3024-night',
                        },
                        {
                            label: 'Light',
                            onClick: () => dispatch(setEditorTheme('3024-day')),
                            selected: () => editorTheme === '3024-day',
                        },
                        {
                            label: 'Soft Dark',
                            onClick: () => dispatch(setEditorTheme('base16-dark')),
                            selected: () => editorTheme === 'base16-dark',
                        },
                        {
                            label: 'Soft Light',
                            onClick: () => dispatch(setEditorTheme('base16-light')),
                            selected: () => editorTheme === 'base16-light',
                        },
                    ]}
                />
            </div>
        );
    }
}
