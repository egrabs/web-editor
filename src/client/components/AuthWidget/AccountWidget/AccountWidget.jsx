import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import { logout } from '../../../redux/Auth/AuthActions';
import { getAuthState } from '../../../redux/Auth/AuthReducer';

import styles from './AccountWidget.scss';

import userIcon from '../../../images/user.svg';

function AccountWidget(props) {
    const { dispatch, username } = props;
    return (
        <div className={styles.accountContainer}>
            <DropDownMenu
                hangLeft
                buttonContents={(
                    <span className={styles.accountIcon}>
                        <SVGInline svg={userIcon} />
                    </span>
                )}
            >
                <div className={styles.accountInfoContainer}>
                    <div className={styles.userName}>{username}</div>
                    <hr className={styles.separator} />
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(logout());
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </DropDownMenu>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { username } = getAuthState(state);
    return {
        username,
    };
};

export default connect(mapStateToProps)(AccountWidget);
