import React from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom';

import LoginForm from "./login.jsx";
import Signup from "./signup.jsx";

class App extends React.Component {
        render() {
            return (
                <BrowserRouter>
                    <div>
                        <Route exact={true} path="/" render={() => (
                            <div>
                                <h3>Hello!</h3>
                                <p><Link to="/login">Login</Link> or <Link to="/signup">Signup</Link></p>
                            </div>
                        )}/>

                        <LoginForm/>
                    </div>
                </BrowserRouter>
        );
    }
}

 export default App;