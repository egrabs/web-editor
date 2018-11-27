import React from 'react';

import FileNameInput from '../FileNameInput/FileNameInput';
import HeaderDropdownBar from './HeaderDropdownBar/HeaderDropdownBar';
import AuthWidget from '../../AuthWidget/AuthWidget';

import styles from './StandardHeader.scss';

export default function StandardHeader() {
    return (
        <div className={styles.header}>
            <FileNameInput />
            <HeaderDropdownBar />
            <AuthWidget />
        </div>
    );
}

// example of sort-of how connect might hypothetically work

/* eslint-disable */

// function connect(mapStateToProps) {
//     const thingsToAddToProps = Object.assign(mapStateToProps(state), { dispatch: /* whatever function dispatch is */ });
//     return function(ReactComponent) {
//         return function wrappedReactComponent(props) {
//             return (
//                 <ReactComponent {...props} {...thingsToAddToProps} />
//             );
//         };
//     };
// }
