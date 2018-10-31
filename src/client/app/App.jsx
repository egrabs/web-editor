/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from '../redux/RootReducer';
import AppContainer from './AppContainer';


/* eslint-disable no-underscore-dangle */
const rootStore = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={rootStore}>
                <AppContainer />
            </Provider>
        );
    }
}
