import icepick from 'icepick';
import ActionTypes from './RootActionTypes';

const initialState = Object.freeze({
    executing: false,
});

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.START_EXECUTION_ANIMATION:
        return icepick.setIn(state, 'executing', true);
    default:
        return state;
    }
}
