import React from 'react';
import AccountService from '../services/account.jsx'
import AuthService from '../services/auth.jsx'
import Form from './form/form.jsx';

export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            endpoint: "",
            form: {
                submitText: "Save",
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
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    render() {
        return (
            <div>
                <h2>Hi, {this.state.account.name}</h2>
                
                <Form handleSubmit={this.handleSubmit} endpoint={ this.state.account.id ? `PUT /api/accounts/${this.state.account.id}` : ""} definition={this.state.form}/>
            </div>
        );
    }

    handleSubmit(res) {
        this.state.account = res
        this.setState(this.state)
    }

    async componentDidMount() {
        const account = await AccountService.get(AuthService.getUser())
        this.state.account = account
        this.state.form.fields = this.state.form.fields.map((field) => {
            field.default = account[field.name] || ""
            return field
        })
        this.setState(this.state)
    }
}