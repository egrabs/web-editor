import icepick from 'icepick';
import ActionTypes from './FileSystemActionTypes';

const initialState = Object.freeze({
    userCode: '',
    fileName: '',
});

export default function fileSystemReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.SET_USER_CODE:
        return icepick.setIn(state, ['userCode'], action.payload);
    case ActionTypes.SET_CURRENT_FILENAME:
        return icepick.setIn(state, ['fileName'], action.payload);
    default:
        return state;
    }
}

const path = 'filesystem';

fileSystemReducer.path = path;

export const getFileSystemState = state => state[path];
