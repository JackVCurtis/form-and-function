import React from 'react';
import {BrowserRouter, Link, Route, Redirect} from 'react-router-dom';

import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Home from './home.jsx';

import AuthService from '../services/auth.jsx';

class App extends React.Component {
        render() {
            return (
                <BrowserRouter>
                    <div className="main">
                        <Route exact={true} path="/" render={() => {
                            return AuthService.isLoggedIn() ? (<Redirect to="/home"/>) : (<Redirect to="/login"/>)
                        }}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/home" component={Home}/>
                    </div>
                </BrowserRouter>
        );
    }
}

 export default App;