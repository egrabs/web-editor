import ActionTypes from './FileSystemActionTypes';

export const setUserCode = code => ({
    type: ActionTypes.SET_USER_CODE,
    payload: code,
});