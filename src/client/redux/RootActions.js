import ActionTypes from './RootActionTypes';

export const setExecutionResults = execResults => ({
    type: ActionTypes.SET_EXECUTION_RESULTS,
    payload: execResults,
});

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

export const stopDebugMode = () => ({
    type: ActionTypes.STOP_DEBUG_MODE,
});

export const setDebugOutput = debugOutput => ({
    type: ActionTypes.SET_DEBUG_OUTPUT,
    payload: debugOutput,
});

export const loginSuccess = ({ username }) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    payload: { username },
});

export const logout = {
    type: ActionTypes.LOGOUT,
};

export const setAST = ast => ({
    type: ActionTypes.SET_AST,
    payload: ast,
});

export const setEditorMode = editorMode => ({
    type: ActionTypes.SET_EDITOR_MODE,
    payload: editorMode,
});

export const setEditorTheme = editorTheme => ({
    type: ActionTypes.SET_EDITOR_THEME,
    payload: editorTheme,
});

export const restoreDefaults = () => ({
    type: ActionTypes.RESTORE_DEFAULTS,
});
