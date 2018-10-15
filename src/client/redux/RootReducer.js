import icepick from 'icepick';
import ActionTypes from './RootActionTypes';

const initialState = Object.freeze({
    executing: false,
    autoComplete: true,
});

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.START_EXECUTION_ANIMATION:
        return icepick.setIn(state, ['executing'], true);
    case ActionTypes.STOP_EXECUTION_ANIMATION:
        return icepick.setIn(state, ['executing'], false);
    case ActionTypes.TOGGLE_AUTO_COMPLETE:
        return icepick.setIn(state, ['autoComplete'], !state.autoComplete);
    default:
        return state;
    }
}
