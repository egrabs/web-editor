import React from 'react';
import { connect } from 'react-redux';

import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import { setEditorMode, setEditorTheme } from '../../../redux/RootActions';

import styles from './StandardHeader.scss';

function StandardHeader(props) {
    const { editorMode, editorTheme, dispatch } = props;

    return (
        <div className={styles.header}>
            <DropDownMenu
                label="Select Language"
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
                label="Select Theme"
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

const mapStateToProps = state => ({
    editorMode: state.editorMode,
    editorTheme: state.editorTheme,
});

export default connect(mapStateToProps)(StandardHeader);

// example of sort-of how connect might hypothetically work

// function connect(mapStateToProps) {
//     const thingsToAddToProps = mapStateToProps(state);
//     return function(reactComponent) {
//         return function wrappedReactComponent(props) {
//             return (
//                 <reactComponent {...props} {...thingsToAddToProps} />
//             );
//         };
//     };
// }
