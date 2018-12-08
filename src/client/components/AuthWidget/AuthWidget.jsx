import React from 'react';
import { connect } from 'react-redux';

import AccountWidget from './AccountWidget/AccountWidget';
import Login from './Login/Login';
import { getAuthState } from '../../redux/Auth/AuthReducer';

@connect(state => ({ authed: getAuthState(state).authed }))
export default class AuthWidget extends React.Component {
    render() {
        const { authed } = this.props;
        return authed ? <AccountWidget /> : <Login />;
    }
}
