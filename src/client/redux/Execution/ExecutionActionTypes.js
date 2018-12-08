import keymirror from 'mirrarray';

const ExecutionActionTypes = keymirror([
    'START_DEBUG_MODE',
    'STOP_DEBUG_MODE',
    'SET_DEBUG_OUTPUT',
    'SET_EXECUTION_RESULTS',
]);

export default ExecutionActionTypes;
