import ActionTypes from './RootActionTypes';

export const startExecutionAnimation = {
    type: ActionTypes.START_EXECUTION_ANIMATION,
};

export const stopExecutionAnimation = {
    type: ActionTypes.STOP_EXECUTION_ANIMATION,
};

export const toggleAutoComplete = {
    type: ActionTypes.TOGGLE_AUTO_COMPLETE,
};

export const startDebugMode = seshId => ({
    type: ActionTypes.START_DEBUG_MODE,
    payload: seshId,
});
