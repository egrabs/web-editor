import ActionTypes from './ExecutionActionTypes';

export const setExecutionResults = execResults => ({
    type: ActionTypes.SET_EXECUTION_RESULTS,
    payload: execResults,
});

export const startDebugMode = seshId => ({
    type: ActionTypes.START_DEBUG_MODE,
    payload: seshId,
});

export const stopDebugMode = () => ({
    type: ActionTypes.STOP_DEBUG_MODE,
});

export const setDebugOutput = debugOutput => ({
    type: ActionTypes.SET_DEBUG_OUTPUT,
    payload: debugOutput,
});
