/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from '../redux/RootReducer';
import AppContainer from './AppContainer';

const rootStore = createStore(rootReducer);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={rootStore}>
                <AppContainer />
            </Provider>
        );
    }
}
