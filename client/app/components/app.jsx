import React from 'react';
import {BrowserRouter, Link, Route, Redirect} from 'react-router-dom';

import Login from "./login.jsx";
import Signup from "./signup.jsx";

import AuthService from '../services/auth.jsx';

class App extends React.Component {
        render() {
            return (
                <BrowserRouter>
                    <div className="main">
                        <Route exact={true} path="/" render={() => {
                            return AuthService.isLoggedIn() ? (<h2>Hello</h2>) : (<Redirect to="/login"/>)
                        }}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                    </div>
                </BrowserRouter>
        );
    }
}

 export default App;