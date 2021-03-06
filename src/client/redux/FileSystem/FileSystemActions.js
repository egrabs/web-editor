import ActionTypes from './FileSystemActionTypes';
import request from '../../utils/requests';
import { hydrateFiles, hydrateFile, lastModifiedSorter } from '../../utils/FileUtils';
import annotateWithReactKeys from '../../utils/reactAnnotations';

export const setUserCode = code => ({
    type: ActionTypes.SET_USER_CODE,
    payload: code,
});

export const loadFiles = () => dispatch => (
    request('GET', '/files')
        .params({})
        .then(res => res.json())
        .then(({ files }) => annotateWithReactKeys(files))
        .then((files) => {
            const hydrated = hydrateFiles(files);
            dispatch({
                type: ActionTypes.SET_FILES,
                payload: hydrated,
            });
            return hydrated;
        })
);

export const setDefaultFile = files => (dispatch) => {
    files.sort(lastModifiedSorter);
    dispatch({
        type: ActionTypes.SET_DEFAULT_FILE,
        payload: { files },
    });
};

export const setCurrentFile = file => ({
    type: ActionTypes.SET_CURRENT_FILE,
    payload: file,
});

export const newFile = () => (dispatch) => {
    request('PUT', '/files/save')
        .body({})
        .then(res => res.json())
        .then((res) => {
            const { file } = res;
            dispatch(loadFiles());
            dispatch(setCurrentFile(hydrateFile(file)));
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

export const blastFileSystem = () => ({
    type: ActionTypes.BLAST_FILE_SYSTEM,
});
