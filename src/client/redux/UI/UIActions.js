import ActionTypes from './UIActionTypes';

export const startExecutionAnimation = {
    type: ActionTypes.START_EXECUTION_ANIMATION,
};

export const stopExecutionAnimation = {
    type: ActionTypes.STOP_EXECUTION_ANIMATION,
};

export const toggleAutoComplete = {
    type: ActionTypes.TOGGLE_AUTO_COMPLETE,
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
