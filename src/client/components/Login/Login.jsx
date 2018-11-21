import React from 'react';
import { connect } from 'react-redux';

import DropDownMenu from '../DropDownMenu/DropDownMenu';
import { handleRegister, handleLoginAttempt } from '../../redux/RootActions';
import request from '../../utils/requests';

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

    createAccount = () => {
        const {
            username,
            password,
            passwordConfirm,
            email,
        } = this.state;
        const { dispatch } = this.props;
        if (password === passwordConfirm) {
            request('POST', '/login/register/')
                .body({
                    username,
                    password,
                    email,
                })
                .then(res => res.json())
                .then((res) => {
                    dispatch(handleRegister(res));
                });
        } else {
            // TODO
        }
    };

    signIn = () => {
        const { username, password } = this.state;
        const { dispatch } = this.props;
        request('POST', '/login/')
            .body({
                username,
                password,
            })
            .then(res => res.json())
            .then((res) => {
                dispatch(handleLoginAttempt(res));
            });
    };

    renderSignInBox = () => {
        const { username, password } = this.state;
        return (
            <div className={styles.signInBox}>
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
                    type="button"
                    onClick={this.signIn}
                    className={styles.signInButton}
                >
                    Sign in
                </button>
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
                    onChange={(e) => { this.setState({ passwordConfirm: e.currentTarget.value }); }}
                />
                <input
                    className={styles.inputBox}
                    value={email}
                    placeholder="email"
                    type="text"
                    onChange={(e) => { this.setState({ email: e.currentTarget.value }); }}
                />
                <button
                    type="button"
                    onClick={this.createAccount}
                    className={styles.signInButton}
                >
                    Create Account
                </button>
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
