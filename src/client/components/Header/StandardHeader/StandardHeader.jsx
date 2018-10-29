import React from 'react';
import { connect } from 'react-redux';

import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import { setEditorMode } from '../../../redux/RootActions';

import styles from './StandardHeader.scss';

function StandardHeader(props) {
    const { editorMode, dispatch } = props;

    return (
        <div className={styles.header}>
            <DropDownMenu
                label="Select Language"
                className={styles.languageDropdown}
                menuItems={[
                    {
                        label: 'python',
                        onClick: () => dispatch(setEditorMode('python')),
                        selected: () => editorMode === 'python',
                    },
                    {
                        label: 'javascript',
                        onClick: () => dispatch(setEditorMode('javascript')),
                        selected: () => editorMode === 'javascript',
                    },
                ]}
            />
        </div>
    );
}

const mapStateToProps = state => ({
    editorMode: state.editorMode,
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
