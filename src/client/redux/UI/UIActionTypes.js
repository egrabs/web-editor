import keymirror from 'mirrarray';

const UIActionTypes = keymirror([
    'START_EXECUTION_ANIMATION',
    'STOP_EXECUTION_ANIMATION',
    'TOGGLE_AUTO_COMPLETE',
    'SET_AST',
    'SET_EDITOR_MODE',
    'SET_EDITOR_THEME',
    'RESTORE_DEFAULTS',
]);

export default UIActionTypes;
