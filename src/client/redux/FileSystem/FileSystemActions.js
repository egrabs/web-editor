import ActionTypes from './FileSystemActionTypes';
import request from '../../utils/requests';
import { hydrateFiles, lastModifiedSorter } from '../../utils/FileUtils';

export const setUserCode = code => ({
    type: ActionTypes.SET_USER_CODE,
    payload: code,
});

export const loadFiles = () => dispatch => (
    request('GET', '/files')
        .body({})
        .then(res => res.json())
        .then((res) => {
            let { files } = res;
            files = hydrateFiles(files);
            dispatch({
                type: ActionTypes.SET_FILES,
                payload: files,
            });
            return files;
        })
);

export const setDefaultFile = files => (dispatch) => {
    files.sort(lastModifiedSorter);
    dispatch({
        type: ActionTypes.SET_DEFAULT_FILE,
        payload: { files },
    });
};

export const renameFile = (oldname, newname) => (dispatch) => {
    request('POST', '/files/rename')
        .body({
            oldname,
            newname,
        })
        .then(res => res.json())
        .then((res) => {
            const { filename } = res;
            dispatch(loadFiles());
            dispatch({
                type: ActionTypes.SET_CURRENT_FILENAME,
                payload: filename,
            });
        });
};

export const setCurrentFile = file => ({
    type: ActionTypes.SET_CURRENT_FILE,
    payload: file,
});

export const blastFileSystem = () => ({
    type: ActionTypes.BLAST_FILE_SYSTEM,
});
