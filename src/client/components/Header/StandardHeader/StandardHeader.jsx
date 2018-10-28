import React from 'react';
import { connect } from 'react-redux';

import { setEditorMode } from '../../../redux/RootActions';

import styles from './StandardHeader.scss';

function StandardHeader(props) {
    const { editorMode, dispatch } = props;

    const onChange = (event) => {
        const mode = event.currentTarget.value;
        dispatch(setEditorMode(mode));
    };

    return (
        <div className={styles.header}>
            Header
            <select
                className={styles.selectDropdown}
                value={editorMode}
                onChange={onChange}
            >
                <option value="python">Python</option>
                <option value="javascript">Javascript</option>
            </select>
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
