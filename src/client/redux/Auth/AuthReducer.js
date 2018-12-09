import icepick from 'icepick';
import ActionTypes from './AuthActionTypes';

const initialState = Object.freeze({
    username: '',
    userid: '',
    authed: false,
    email: '',
});

export default function authReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS: {
        const { username, userid, email } = action.payload;
        return icepick.chain(state)
            .setIn(['username'], username)
            .setIn(['userid'], userid)
            .setIn(['email'], email)
            .setIn(['authed'], true)
            .value();
    }
    case ActionTypes.LOGOUT:
        return icepick.chain(state)
            .setIn(['username'], '')
            .setIn(['userid'], '')
            .setIn(['authed'], false)
            .value();
    default:
        return state;
    }
}


const path = 'auth';

authReducer.path = path;

export const getAuthState = state => state[path];
