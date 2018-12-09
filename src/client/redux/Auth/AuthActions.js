import ActionTypes from './AuthActionTypes';
import { loadFiles, setDefaultFile, blastFileSystem } from '../FileSystem/FileSystemActions';
import { setAuthToken } from '../../utils/auth';

export const loginSuccess = ({ username, userid, email }) => (dispatch) => {
    dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { username, userid, email },
    });
    dispatch(loadFiles())
        .then(files => dispatch(setDefaultFile(files)));
};

export const logout = () => (dispatch) => {
    setAuthToken('');
    dispatch(blastFileSystem());
    dispatch({
        type: ActionTypes.LOGOUT,
    });
};
