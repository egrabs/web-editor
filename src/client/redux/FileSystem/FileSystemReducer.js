import icepick from 'icepick';
import ActionTypes from './FileSystemActionTypes';

const initialState = Object.freeze({
    userCode: '',
    filename: '',
    files: [],
});

export default function fileSystemReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.SET_USER_CODE:
        return icepick.setIn(state, ['userCode'], action.payload);

    case ActionTypes.SET_CURRENT_FILE: {
        const { contents, filename } = action.payload;
        return icepick.chain(state)
            .setIn(['userCode'], contents)
            .setIn(['filename'], filename)
            .value();
    }

    case ActionTypes.SET_DEFAULT_FILE: {
        const { files } = action.payload;
        // TODO: sort the files by most recently modified and use that
        // for this action
        if (files.length === 0) return state;
        const { contents, filename } = files[0];
        return icepick.chain(state)
            .setIn(['userCode'], contents)
            .setIn(['filename'], filename)
            .value();
    }

    case ActionTypes.SET_CURRENT_FILENAME:
        return icepick.setIn(state, ['filename'], action.payload);

    case ActionTypes.SET_FILES:
        return icepick.setIn(state, ['files'], action.payload);

    case ActionTypes.BLAST_FILE_SYSTEM:
        return icepick.chain(state)
            .setIn(['filename'], '')
            .setIn(['files'], [])
            .value();

    default:
        return state;
    }
}

const path = 'filesystem';

fileSystemReducer.path = path;

export const getFileSystemState = state => state[path];
