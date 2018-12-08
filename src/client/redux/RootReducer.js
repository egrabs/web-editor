import { combineReducers } from 'redux';

import UIReducer from './UI/UIReducer';
import AuthReducer from './Auth/AuthReducer';
import ExecutionReducer from './Execution/ExecutionReducer';
import FileSystemReducer from './FileSystem/FileSystemReducer';

const rootReducer = combineReducers({
    [UIReducer.path]: UIReducer,
    [AuthReducer.path]: AuthReducer,
    [ExecutionReducer.path]: ExecutionReducer,
    [FileSystemReducer.path]: FileSystemReducer,
});

export default rootReducer;
