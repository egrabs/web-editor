import React from 'react';
import { connect } from 'react-redux';

import { getAuthState } from '../../../redux/Auth/AuthReducer';
import FileNameInput from '../FileNameInput/FileNameInput';
import HeaderDropdownBar from './HeaderDropdownBar/HeaderDropdownBar';
import AuthWidget from '../../AuthWidget/AuthWidget';

import styles from './StandardHeader.scss';

function StandardHeader(props) {
    const { authed } = props;
    return (
        <div className={styles.header}>
            {authed && <FileNameInput />}
            <HeaderDropdownBar />
            <AuthWidget />
        </div>
    );
}

const mapStateToProps = state => ({ authed: getAuthState(state).authed });

export default connect(mapStateToProps)(StandardHeader);

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
