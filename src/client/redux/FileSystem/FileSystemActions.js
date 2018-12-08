import ActionTypes from './FileSystemActionTypes';

export const setUserCode = code => ({
    type: ActionTypes.SET_USER_CODE,
    payload: code,
});

export const setCurrentFileName = fileName => ({
    type: ActionTypes.SET_CURRENT_FILENAME,
    payload: fileName,
});
