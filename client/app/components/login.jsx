import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import AccountService from '../services/account.jsx';
import AuthService from '../services/auth.jsx';
import Form from './form/form.jsx';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.form = {
            submitText: "Log In",
            fields: [
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    default: ""
                },
                {
                    name: "password",
                    label: "Password",
                    type: "password",
                    default: ""
                }
            ]
        };

        this.state = {loginError: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return this.props.loggedIn ? (<Redirect to="/"/>) : (
            <div>
                <h2>Login</h2>
                
                <p>Don't have an account? <Link to="/signup">Signup here</Link></p>

                <Form handleSubmit={this.handleSubmit} endpoint="PUT /api/login" definition={this.form}/>

                {this.state.loginError ? (<p className="error-message">Invalid email or password</p>) : ""}

            </div>
        )           
    }

    handleChange(event) {
        this.state.form[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    async handleSubmit(values) {
        try {
            await AccountService.login(values.email, values.password)
            this.props.updateLoginStatus()
        } catch (err) {
            this.setState({loginError: true});
            console.log(err);
        }

    }
};

export default Login;