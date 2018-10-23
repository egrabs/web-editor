import keymirror from 'mirrarray';

const ActionTypes = keymirror([
    'START_EXECUTION_ANIMATION',
    'STOP_EXECUTION_ANIMATION',
    'TOGGLE_AUTO_COMPLETE',
    'START_DEBUG_MODE',
]);

export default ActionTypes;
