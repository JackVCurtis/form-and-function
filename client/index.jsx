require('./styles/index.scss');
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/components/app.jsx';

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
);