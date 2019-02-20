import React from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../services/auth.jsx'

export default class Menu extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav className={"sidebar" + (this.props.open ? " open" : "")}>
                <h3 onClick={this.props.close}>Close</h3>
                <ul>
                    <li><Link to="/home" onClick={this.props.close}>Home</Link></li>
                    <li><Link to="/home/account" onClick={this.props.close}>My Account</Link></li>
                    <li><a href="/" onClick={this.logout}>Log Out</a></li>
                </ul>
            </nav>
        );
    }

    logout() {
        AuthService.logout()
    }
}