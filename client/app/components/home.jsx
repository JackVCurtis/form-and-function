import React from 'react';
import {BrowserRouter, Link, Route, Redirect} from 'react-router-dom';
import Menu from './menu.jsx';
import MyAccount from './account.jsx';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuOpen: false
        };
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }
    render() {
        return (
            <div className="home">
                <header>
                    <h1 id="title">Form and Function</h1>
                    <h1 id="menu-link" onClick={this.openMenu}>Menu</h1>
                </header>
                <Menu open={this.state.menuOpen} close={this.closeMenu}/>
                <Route path="/home" exact={true} render={() => {return (<p>Home page</p>)}}/>
                <Route path="/home/account" component={MyAccount}/>
            </div>
        );
    }

    openMenu() {
        this.setState({menuOpen: true})
    }

    closeMenu() {
        this.setState({menuOpen: false})
    }
}

 export default Home;