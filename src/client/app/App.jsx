/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Provider } from 'react-redux';

import rootStore from '../redux/RootStore';
import bootstrap from '../utils/bootstrap';
import AppContainer from './AppContainer';

export default class App extends React.Component {
    componentDidMount() {
        bootstrap();
    }

    render() {
        return (
            <Provider store={rootStore}>
                <AppContainer />
            </Provider>
        );
    }
}
