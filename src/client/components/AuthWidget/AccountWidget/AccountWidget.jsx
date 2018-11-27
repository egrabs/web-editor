import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import { logout } from '../../../redux/RootActions';
import { setAuthToken } from '../../../utils/auth';

import styles from './AccountWidget.scss';

import userIcon from '../../../images/user.svg';

function AccountWidget(props) {
    const { dispatch } = props;
    return (
        <div className={styles.accountContainer}>
            <DropDownMenu
                buttonContents={(
                    <span className={styles.accountIcon}>
                        <SVGInline svg={userIcon} />
                    </span>
                )}
            >
                <button
                    type="button"
                    onClick={() => {
                        setAuthToken('');
                        dispatch(logout);
                    }}
                >
                    Sign Out
                </button>
            </DropDownMenu>
        </div>
    );
}

export default connect()(AccountWidget);
