import React from 'react';
import {Link} from 'react-router-dom';

export default (props) => {
    return (
        <nav className={"sidebar" + (props.open ? " open" : "")}>
            <h3 onClick={props.close}>Close</h3>
            <ul>
                <li><Link to="/home" onClick={props.close}>Home</Link></li>
                <li><Link to="/home/account" onClick={props.close}>My Account</Link></li>
            </ul>
        </nav>
    );
}