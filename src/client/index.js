import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';

const reactRoot = document.getElementById('react-root');

if (reactRoot) {
    ReactDOM.render(<App />, reactRoot);
} else {
    console.warn("No DOM element to hook react app to.");
}