import React from 'react';
import {BrowserRouter, Link, Route, Redirect} from 'react-router-dom';

import LoginForm from "./login.jsx";
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
                        <Route path="/login" component={LoginForm}/>
                    </div>
                </BrowserRouter>
        );
    }
}

 export default App;