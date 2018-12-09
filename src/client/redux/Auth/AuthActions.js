import ActionTypes from './AuthActionTypes';

import { setAuthToken } from '../../utils/auth';

export const loginSuccess = ({ username, userid, email }) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: { username, userid, email },
});

export const logout = () => {
    setAuthToken('');
    return {
        type: ActionTypes.LOGOUT,
    };
};
