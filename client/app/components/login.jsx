import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import AccountService from '../services/account.jsx';
import AuthService from '../services/auth.jsx';

class Login extends React.Component {
    constructor(props) {
        super(props);
        // The names of the form elements must match the name of the corresponding state property
        this.state = {loggedIn: AuthService.isLoggedIn(), form: {email: "", password: ""}};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return this.state.loggedIn ? (<Redirect to="/"/>) : (
            <div>
                <h2>Login</h2>
                
                <p>Don't have an account? <Link to="/signup">Signup here</Link></p>

                <form>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={this.state.form.email} onChange={this.handleChange}/>
                
                    <label htmlFor="password">Password</label>
                    <input type="text" password="" name="password" value={this.state.form.password} onChange={this.handleChange}/>

                    <div className="button" onClick={this.handleSubmit}>Login</div>
                </form>
            </div>
        )           
    }

    handleChange(event) {
        this.state.form[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    async handleSubmit() {
        try {
            await AccountService.login(this.state.form.email, this.state.form.password);
            this.state.loggedIn = AuthService.isLoggedIn();
            this.setState(this.state);
        } catch (err) {

        }

    }
};

export default Login;