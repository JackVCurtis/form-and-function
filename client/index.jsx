require('./styles/index.scss');
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/components/app.jsx';
import {BrowserRouter} from 'react-router-dom';


ReactDOM.render(
    (<BrowserRouter>
        <App/>
    </BrowserRouter>),
    document.getElementById('root')
);