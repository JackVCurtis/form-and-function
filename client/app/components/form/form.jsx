import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/auth.jsx';
import ValidatorService from '../../services/validatorService.jsx';

class Form extends React.Component {
    /*
        props - endpoint, handleSubmit, definition

        definition = {
            submitText: string,
            fields: [
                {
                    name: string (matches api field),
                    type: string (input type),
                    label: string
                    options: [] (optional, for radio, checkbox and select)
                }
            ]
        }
    */
    constructor(props) {
        super(props);
        this.endpoint = props.endpoint;
        this.validations = undefined;
        this.state = {
            form: {
                submitText: props.definition.submitText,
                fields: this.generateFields(props.definition)
            }
        }
        this.submitFunction = props.handleSubmit;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.getValue = this.getValue.bind(this);
        this.getComponent = this.getComponent.bind(this);
    }

    render() {
        return (
                    <form onKeyDown={this.handleSubmit}>
                        { this.state.form.fields.map(this.getComponent) }

                        <div type="submit" className={this.canSubmit() ? "button" : "button disabled"} onClick={this.handleSubmit}>{this.state.form.submitText}</div>
                    </form>
            )
    }

    getComponent(field) {
        switch (field.type) {
            case 'text':
                return (
                    <div key={field.name} className={ this.hasError(field.name) ? "form-group has-error" : "form-group"}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input type="text" name={field.name} value={this.getValue(field.name)} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        { this.getErrorsFor(field.name) }
                    </div>
                );
            case 'password':
                return (
                    <div key={field.name} className={ this.hasError(field.name) ? "form-group has-error" : "form-group"}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input type="password" name={field.name} value={this.getValue(field.name)} onChange={this.handleChange} onBlur={this.handleBlur}/>
                        { this.getErrorsFor(field.name) }
                    </div>
                );
        }
    }

    async handleChange(event) {
        if (event.target) {
            const touchedIndex = this.state.form.fields.findIndex((input) => { return input.name == event.target.name; });
            const touchedInput = this.state.form.fields[touchedIndex];
            touchedInput.value = event.target.value;

            if (touchedIndex == this.state.form.fields.length - 1) {
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
        if (this.validations) {
            console.log("Running validate")
            const validationObject = this.getValues();

            const validations = this.validations.filter((validation) => {
                return validation.fields.reduce((acc, field) => { 
                    const fieldShouldValidate = this.inputsToValidate().find((input) => {return input.name == field; }) != undefined;
                    return acc && fieldShouldValidate;
                }, true);
            });
            
            this.state.form.fields.forEach((input) => {
                input.errors = [];
            });

            const results = await ValidatorService.validate(validationObject, validations, this.endpoint);
            this.inputsToValidate().forEach((input) => {
                const errors = results.map((result) => {
                    if (result.result == false && 
                        result.fields.findIndex((field) => {return input.name == field}) > -1) {
                        return result.message;
                    }
                }).filter((err) => { return !!err; });

                input.errors = errors;
                input.shouldValidate = errors.length > 0;
                input.beenValidated = errors.length == 0;
            });

            this.state.form.isValid = results.filter((result) => {return !result.result}).length == 0;
            this.setState(this.state);
        }
    }

    async componentDidMount(){
        const reqParams = this.endpoint.split(" ");
        try {
            const res = await axios({
                method: reqParams[0],
                url: reqParams[1],
                data: {
                    meta_request: "describe"
                }
            })
            this.validations = res.data.validations;
        } catch (e) {
            console.log("Could not fetch validations");
        }
    }

    handleSubmit(e) {
        if ((e.type == "click" || e.keyCode == 13) && this.state.form.isValid) {
            this.submitFunction(this.getValues());            
        }
    }

    generateFields(definition) {
        return definition.fields.map((def) => {
            return  {
                name: def.name,
                label: def.label,
                type: def.type,
                value: def.default,
                errors: [],
                shouldValidate: false,
                beenValidated: false,
            }
        });
    }

    getValue(fieldName) {
        return this.state.form.fields.find((field) => field.name == fieldName).value;
    }

    getValues() {
        return this.state.form.fields.reduce((obj, input) => { 
            obj[input.name] = input.value; 
            return obj;
        }, {});
    }

    canSubmit() {
        return this.state.form.fields.reduce((acc, field) => { 
            return field.beenValidated && acc
        }, true);
    }

    hasError(name) {
        return this.getErrorsFor(name).length > 0;            
    }

    getErrorsFor(name) {
        return this.state.form.fields.find((field) => {return field.name == name}).errors
            .map((error, i) => {return (<p key={i} className="error-message">{error}</p>)})
    }

    inputsToValidate() {
        return this.state.form.fields.filter((input) => { return input.shouldValidate; });
    }
};

export default Form;