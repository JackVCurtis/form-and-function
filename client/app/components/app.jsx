import React from 'react';
import {BrowserRouter, Link, Route, Redirect, withRouter} from 'react-router-dom';

import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Home from './home.jsx';

import AuthService from '../services/auth.jsx';

class BaseApp extends React.Component {
        constructor(props) {
            super(props)
            AuthService.setHeader()
            this.state = {
                loggedIn: AuthService.isLoggedIn()
            }
            this.updateLoginStatus = this.updateLoginStatus.bind(this)
        }

        render() {
            return (
                <Route path="/">
                    <div className="main">
                        {this.redirectWhenLoggedOut()}
                        <Route path="/login" render={(props) => <Login loggedIn={this.state.loggedIn} updateLoginStatus={this.updateLoginStatus}/>} />
                        <Route path="/signup" render={(props) => <Signup loggedIn={this.state.loggedIn} updateLoginStatus={this.updateLoginStatus}/>}/>
                        <Route path="/home" component={Home}/>
                    </div>
                </Route>
            );
        }

        redirectWhenLoggedOut(){
            if (!this.state.loggedIn && !this.unprotectedPath()) {
                return (<Redirect to="/login"/>)
            } else {
                return (<Route exact={true} path="/" render={() => (<Redirect to="/home"/>)}/>)
            }
        }

        updateLoginStatus() {
            this.setState({loggedIn: AuthService.isLoggedIn()})   
        }

        unprotectedPath() {
            return this.props.location.pathname == "/signup" || this.props.location.pathname == "/login"
        }
}

const App = withRouter(props => <BaseApp {...props}/>);


export default App;