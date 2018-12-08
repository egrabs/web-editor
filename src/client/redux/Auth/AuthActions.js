import ActionTypes from './AuthActionTypes';

export const loginSuccess = ({ username, userid }) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: { username, userid },
});

export const logout = {
    type: ActionTypes.LOGOUT,
};
