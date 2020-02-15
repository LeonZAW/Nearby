import React from 'react';
import logo from '../images/logo.svg';
import { Icon } from 'antd';
// import PropTypes from 'prop-types';

export class Header extends React.Component {
    // static propTypes = {
    //     isLoggedIn: PropTypes.bool.isRequired,
    //     handleLogout: PropTypes.string.isRequired,
    // }
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Nearby</h1>
                {
                    this.props.isLoggedIn?
                        <a href="#0" className="logout" onClick={this.props.handleLogout}>
                        <Icon type="logout" />{' '}Logout
                        </a> : null
                }
            </header>
        );
    }
}