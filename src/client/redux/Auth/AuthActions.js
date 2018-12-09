import ActionTypes from './AuthActionTypes';

import { setAuthToken } from '../../utils/auth';

export const loginSuccess = ({ username, userid }) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: { username, userid },
});

export const logout = () => {
    setAuthToken('');
    return {
        type: ActionTypes.LOGOUT,
    };
};
