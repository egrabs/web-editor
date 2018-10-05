/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from '../redux/RootReducer';
import CodeEditor from '../components/CodeEditor/CodeEditor';

const rootStore = createStore(rootReducer);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={rootStore}>
                <section>
                    <div>Header</div>
                    <div>
                        {/* Gotta figure out how to hide this then slide
                        it in nicely such that it doesn't end up displaying
                        "block" / stacking with the other divs */}
                        Sidebar
                    </div>
                    <div>
                        Body
                        {/* the actual structure of the html should probably
                        go in a separate component called AppContainer or something
                        but this is ok for now -- just spec'ing out the structure */}
                        <CodeEditor />
                    </div>
                </section>
            </Provider>
        );
    }
}
