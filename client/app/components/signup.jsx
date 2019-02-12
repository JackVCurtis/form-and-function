import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import AccountService from '../services/account.jsx';
import AuthService from '../services/auth.jsx';
import ValidatorService from '../services/validatorService.jsx';
import Form from './form/form.jsx';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.form = {
            submitText: "Signup",
            fields: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    default: ""
                },
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
                },
                {
                    name: "confirmPassword",
                    label: "Confirm Password",
                    type: "password",
                    default: ""
                }
            ]

        };

        this.state = {
            signedUp: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return this.state.signedUp ? (<Redirect to="/"/>) : (
                <div>
                    <h2>Signup</h2>
                    
                    <p>Already have an account? <Link to="/login">Login here</Link></p>

                    <Form handleSubmit={this.handleSubmit} endpoint="POST /api/accounts" definition={this.form}/>
                </div>
            )
    }

    async handleSubmit(values) {
        try {
            await AccountService.signup(values);
            this.state.signedUp = true;
            this.setState(this.state);
        } catch (err) {

        }
    }
};

export default Signup;