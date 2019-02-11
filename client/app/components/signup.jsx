import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import AccountService from '../services/account.jsx';
import AuthService from '../services/auth.jsx';
import ValidatorService from '../services/validatorService.jsx';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signedUp: false,
            form: {
                endpoint: "POST /api/accounts",
                validations: undefined,
                fields: [
                    {
                        name: "name",
                        label: "Name",
                        value: "",
                        errors: [],
                        shouldValidate: false
                    },
                    {
                        name: "email",
                        label: "Email",
                        value: "",
                        errors: [],
                        shouldValidate: false
                    },
                    {
                        name: "password",
                        label: "Password",
                        value: "",
                        errors: [],
                        shouldValidate: false
                    }, 
                    {
                        name: "confirmPassword",
                        label: "Confirm Password",
                        value: "",
                        errors: [],
                        shouldValidate: false
                    }
                ]
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    render() {
        return this.state.signedUp ? (<Redirect to="/"/>) : (
                <div>
                    <h2>Signup</h2>
                    
                    <p>Already have an account? <Link to="/login">Login here</Link></p>

                    <form>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={this.state.form.name} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        { this.getErrorsFor("name") }
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" value={this.state.form.email} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        { this.getErrorsFor("email") }
                        <label htmlFor="password">Password</label>
                        <input type="password" password="" name="password" value={this.state.form.password} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        { this.getErrorsFor("password") }
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" password="" name="confirmPassword" value={this.state.form.confirmPassword} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        { this.getErrorsFor("confirmPassword") }
                        <div className="button" onClick={this.handleSubmit}>Sign Up</div>
                    </form>
                </div>
            )
    }

    async handleChange(event) {
        if (event.target) {
            const touchedIndex = this.state.form.fields.findIndex((input) => { return input.name == event.target.name; });
            const touchedInput = this.state.form.fields[touchedIndex];
            touchedInput.value = event.target.value;

            if (touchedIndex == this.state.form.fields.length - 1) {
                console.log("validating last field");
                touchedInput.shouldValidate = true;
                await this.validate();
            } else {
                this.setState(this.state);
            }
        }
    }

    async handleBlur(event) {
        const touchedIndex = this.state.form.fields.findIndex((input) => { return input.name == event.target.name; });
        this.state.form.fields[touchedIndex].shouldValidate = true;
        await this.validate();
    }

    async validate() {
        if (this.state.form.validations) {
            const validationObject = this.state.form.fields.reduce((obj, input) => { 
                obj[input.name] = input.value; 
                return obj;
            }, {});

            const validations = this.state.form.validations.filter((validation) => {
                return validation.fields.reduce((acc, field) => { 
                    const fieldShouldValidate = this.inputsToValidate().find((input) => {return input.name == field; }) != undefined;
                    return acc && fieldShouldValidate;
                }, true);
            });
            
            this.state.form.fields.forEach((input) => {
                input.errors = [];
            });

            const results = await ValidatorService.validate(validationObject, validations, this.state.form.endpoint);
            this.inputsToValidate().forEach((input) => {
                const errors = results.map((result) => {
                    if (result.result == false && 
                        result.fields.findIndex((field) => {return input.name == field}) > -1) {
                        return result.message;
                    }
                }).filter((err) => { return !!err; });

                input.errors = errors;
                input.shouldValidate = errors.length > 0;
            });

            this.setState(this.state);
        }
    }

    async componentDidMount(){
        const reqParams = this.state.form.endpoint.split(" ");
        try {
            const res = await axios({
                method: reqParams[0],
                url: reqParams[1],
                data: {
                    meta_request: "describe"
                }
            })

            this.state.form.validations = res.data.validations;
        } catch (e) {
            console.log("Could not fetch validations");
        }
    }

    async handleSubmit() {
        try {
            await AccountService.signup(this.state.form.name, this.state.form.email, this.state.form.password);
            this.state.signedUp = true;
            this.setState(this.state);
        } catch (err) {

        }
    }

    getErrorsFor(name) {
        return this.state.form.fields.find((field) => {return field.name == name}).errors
            .map((error, i) => {return (<p key={i} >{error}</p>)})
    }

    inputsToValidate() {
        return this.state.form.fields.filter((input) => { return input.shouldValidate; });
    }
};

export default Signup;