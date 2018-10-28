import icepick from 'icepick';
import ActionTypes from './RootActionTypes';

const initialState = Object.freeze({
    executing: false,
    autoComplete: true,
    debugMode: false,
    debugSeshId: null,
    debugOutput: '',
    ast: '',
    editorMode: 'python',
});

// Ok, it's officially time to split this into subject-matter
// specific reducers. . . whenever there's time 😓
export default function rootReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.START_EXECUTION_ANIMATION:
        return icepick.setIn(state, ['executing'], true);
    case ActionTypes.STOP_EXECUTION_ANIMATION:
        return icepick.setIn(state, ['executing'], false);
    case ActionTypes.TOGGLE_AUTO_COMPLETE:
        return icepick.setIn(state, ['autoComplete'], !state.autoComplete);
    case ActionTypes.START_DEBUG_MODE:
        return icepick.chain(state)
            .setIn(['debugMode'], true)
            .setIn(['debugSeshId'], action.payload)
            .value();
    case ActionTypes.STOP_DEBUG_MODE:
        return icepick.chain(state)
            .setIn(['debugMode'], false)
            .setIn(['debugSeshId'], null)
            .setIn(['debugOutput'], '')
            .value();
    case ActionTypes.SET_DEBUG_OUTPUT:
        return icepick.setIn(
            state,
            ['debugOutput'],
            `${state.debugOutput}\n${action.payload}`,
        );
    case ActionTypes.SET_AST:
        return icepick.setIn(state, ['ast'], action.payload);
    case ActionTypes.SET_EDITOR_MODE:
        return icepick.setIn(state, ['editorMode'], action.payload);
    default:
        return state;
    }
}
