import React from 'react';
import { connect } from 'react-redux';

import DropDownMenu from '../../../DropDownMenu/DropDownMenu';
import { setEditorMode, setEditorTheme } from '../../../../redux/RootActions';
import request from '../../../../utils/requests';

import styles from './HeaderDropdownBar.scss';

const mapStateToProps = state => ({
    editorMode: state.editorMode,
    editorTheme: state.editorTheme,
    authed: state.authed,
    userCode: state.userCode,
});

@connect(mapStateToProps)
export default class HeaderDropdownBar extends React.Component {
    saveCurrentFile = () => {
        const { userCode } = this.props;
        request('POST', '/save')
            .body({
                fileContents: userCode,
            })
            .then(res => res.json());
        // .then(res => )
    }

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
                            onClick: () => undefined,
                            hidden: () => !authed,
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
