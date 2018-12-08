import icepick from 'icepick';
import ActionTypes from './ExecutionActionTypes';

const initialState = Object.freeze({
    executionResults: {},
    debugMode: false,
    debugSeshId: null,
    debugOutput: '',
});

export default function executionReducer(state = initialState, action) {
    switch (action.type) {
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
    case ActionTypes.SET_EXECUTION_RESULTS:
        return icepick.setIn(state, ['executionResults'], action.payload);

    default:
        return state;
    }
}

const path = 'execution';

executionReducer.path = path;

export const getExecutionState = state => state[path];
