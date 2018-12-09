import React from 'react';
import { connect } from 'react-redux';

import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import { loginSuccess } from '../../../redux/Auth/AuthActions';
import request from '../../../utils/requests';
import { setAuthToken } from '../../../utils/auth';

import styles from './Login.scss';

@connect()
export default class Login extends React.Component {
    state = {
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        register: false,
    };

    createAccount = (e) => {
        e.preventDefault();
        const {
            username,
            password,
            passwordConfirm,
            email,
        } = this.state;
        if (password === passwordConfirm) {
            request('POST', '/login/register/')
                .body({
                    username,
                    password,
                    email,
                })
                .then(this.authenticate)
                // TODO
                .catch(() => undefined);
        } else {
            // TODO
        }
    };

    signIn = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        request('POST', '/login/')
            .body({
                username,
                password,
            })
            .then(res => res.json())
            .then(this.authenticate)
            // TODO
            .catch(() => undefined);
    };

    authenticate = (res) => {
        // TODO handle case where auth fails
        const {
            username,
            token,
            userid,
            email,
        } = res;
        const { dispatch } = this.props;
        setAuthToken(`Basic ${btoa(`${userid}:${token}`)}`);
        dispatch(loginSuccess({ username, userid, email }));
    };

    renderSignInBox = () => {
        const { username, password } = this.state;
        return (
            <div className={styles.signInBox}>
                <form onSubmit={this.signIn}>
                    <input
                        className={styles.inputBox}
                        value={username}
                        placeholder="username"
                        type="text"
                        onChange={(e) => { this.setState({ username: e.currentTarget.value }); }}
                    />
                    <input
                        className={styles.inputBox}
                        value={password}
                        type="password"
                        placeholder="password"
                        onChange={(e) => { this.setState({ password: e.currentTarget.value }); }}
                    />
                    <button
                        type="submit"
                        className={styles.signInButton}
                    >
                        Sign in
                    </button>
                </form>
            </div>
        );
    };

    renderRegisterBox = () => {
        const {
            username,
            password,
            passwordConfirm,
            email,
        } = this.state;
        return (
            <div className={styles.registerBox}>
                <form onSubmit={this.createAccount}>
                    <input
                        className={styles.inputBox}
                        value={username}
                        placeholder="create a username"
                        type="text"
                        onChange={(e) => { this.setState({ username: e.currentTarget.value }); }}
                    />
                    <input
                        className={styles.inputBox}
                        value={password}
                        type="password"
                        placeholder="password"
                        onChange={(e) => { this.setState({ password: e.currentTarget.value }); }}
                    />
                    <input
                        className={styles.inputBox}
                        value={passwordConfirm}
                        type="password"
                        placeholder="confirm"
                        onChange={(e) => {
                            this.setState({ passwordConfirm: e.currentTarget.value });
                        }}
                    />
                    <input
                        className={styles.inputBox}
                        value={email}
                        placeholder="email"
                        type="text"
                        onChange={(e) => { this.setState({ email: e.currentTarget.value }); }}
                    />
                    <button
                        type="submit"
                        className={styles.signInButton}
                    >
                    Create Account
                    </button>
                </form>
            </div>
        );
    };

    renderContents = () => {
        const { register } = this.state;
        return register ? this.renderRegisterBox() : this.renderSignInBox();
    };

    render() {
        const { register } = this.state;
        return (
            <DropDownMenu
                label="Sign in"
                downArrow={false}
                className={styles.signIn}
                hangLeft
            >
                <div className={styles.innerContainer}>
                    {this.renderContents()}
                    <button
                        className={styles.registerButton}
                        type="button"
                        onClick={() => {
                            this.setState(prevState => ({
                                register: !prevState.register,
                                username: '',
                                password: '',
                                email: '',
                                passwordConfirm: '',
                            }));
                        }}
                    >
                        {register ? 'Sign in' : 'Register'}
                    </button>
                </div>
            </DropDownMenu>
        );
    }
}
