import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

import SexyButton from '../../SexyButton/SexyButton';
import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import { logout } from '../../../redux/Auth/AuthActions';
import { getAuthState } from '../../../redux/Auth/AuthReducer';

import styles from './AccountWidget.scss';

import userIcon from '../../../images/user.svg';

function AccountWidget(props) {
    const { dispatch, username, email } = props;
    return (
        <div className={styles.accountContainer}>
            <DropDownMenu
                buttonClass={styles.accountButton}
                hangLeft
                buttonContents={<SVGInline className={styles.accountIcon} svg={userIcon} />}
            >
                <div className={styles.accountInfoContainer}>
                    <div className={styles.accountInfo}>{username}</div>
                    <div className={styles.accountInfo}>{email}</div>
                    <hr className={styles.separator} />
                    <SexyButton
                        onClick={() => {
                            dispatch(logout());
                        }}
                    >
                        Sign Out
                    </SexyButton>
                </div>
            </DropDownMenu>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { username, email } = getAuthState(state);
    return {
        username,
        email,
    };
};

export default connect(mapStateToProps)(AccountWidget);
