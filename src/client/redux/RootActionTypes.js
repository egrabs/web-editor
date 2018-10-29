import keymirror from 'mirrarray';

const ActionTypes = keymirror([
    'START_EXECUTION_ANIMATION',
    'STOP_EXECUTION_ANIMATION',
    'TOGGLE_AUTO_COMPLETE',
    'START_DEBUG_MODE',
    'STOP_DEBUG_MODE',
    'SET_DEBUG_OUTPUT',
    'SET_AST',
    'SET_EDITOR_MODE',
    'SET_EXECUTION_RESULTS',
]);

export default ActionTypes;
