import icepick from 'icepick';
import ActionTypes from './UIActionTypes';

const initialState = Object.freeze({
    executing: false,
    autoComplete: true,
    ast: '',
    editorMode: 'python',
    editorTheme: '3024-night',
});

export default function uiReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.TOGGLE_AUTO_COMPLETE:
        return icepick.setIn(state, ['autoComplete'], !state.autoComplete);
    case ActionTypes.SET_AST:
        return icepick.setIn(state, ['ast'], action.payload);
    case ActionTypes.SET_EDITOR_MODE:
        return icepick.setIn(state, ['editorMode'], action.payload);
    case ActionTypes.SET_EDITOR_THEME:
        return icepick.setIn(state, ['editorTheme'], action.payload);
    case ActionTypes.RESTORE_DEFAULTS:
        return icepick.chain(state)
            .setIn(['autoComplete'], true)
            .setIn(['editorMode'], 'python')
            .setIn(['editorTheme'], '3024-night')
            .value();
    default:
        return state;
    }
}

const path = 'ui';

uiReducer.path = path;

export const getUIState = state => state[path];
