import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import AccountService from '../services/account.jsx';
import AuthService from '../services/auth.jsx';
import ValidatorService from '../services/validatorService.jsx';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        // The names of the form elements must match the name of the corresponding state property
        this.state = {signedUp: false, form: {name: "", email: "", password: "", confirmPassword: ""}};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return this.state.signedUp ? (<Redirect to="/"/>) : (
                <div>
                    <h2>Signup</h2>
                    
                    <p>Already have an account? <Link to="/login">Login here</Link></p>

                    <form>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={this.state.form.name} onChange={this.handleChange}/>

                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" value={this.state.form.email} onChange={this.handleChange}/>
                    
                        <label htmlFor="password">Password</label>
                        <input type="password" password="" name="password" value={this.state.form.password} onChange={this.handleChange}/>

                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" password="" name="confirmPassword" value={this.state.form.confirmPassword} onChange={this.handleChange}/>

                        <div className="button" onClick={this.handleSubmit}>Sign Up</div>
                    </form>
                </div>
            )
    }

    handleChange(event) {
        this.state.form[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    async handleSubmit() {
        console.log(await ValidatorService.validate(this.state.form, [
            {fields: ["email"], validators: ["isUnique:accounts,email", "exists", "isEmailFormat"], endpoint: "POST /api/accounts"},
            {fields: ["name"], validators: ["exists"]},
            {fields: ["password"], validators: ["exists", "isSecurePass"]},
            {fields: ["password", "confirmPassword"], validators: ["matches"]}
        ], "post /api/accounts"))
        // try {
        //     await AccountService.signup(this.state.form.name, this.state.form.email, this.state.form.password);
        //     this.state.signedUp = true;
        //     this.setState(this.state);
        // } catch (err) {

        // }

    }
};

export default Signup;