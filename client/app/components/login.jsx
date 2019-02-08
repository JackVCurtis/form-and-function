import React from 'react';

import AccountService from '../services/account.jsx';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        // The names of the form elements must match the name of the corresponding state property
        this.state = {email: "", password: ""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
            <h3>Login</h3>
            <form>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
 
                <label htmlFor="password">Password</label>
                <input type="text" password="" name="password" value={this.state.password} onChange={this.handleChange}/>

                <div className="button" onClick={this.handleSubmit} style={{padding: "5px", border: "1px solid black"}}>Login</div>
            </form>
            </div>
        )
    }

    handleChange(event) {
        this.state[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    async handleSubmit() {
      await AccountService.login(this.state.email, this.state.password);
    }
};

export default LoginForm;