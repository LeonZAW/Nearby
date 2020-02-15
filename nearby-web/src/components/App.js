import React from 'react';
import { Header } from './Header';
import { Main } from './Main';
import { TOKEN_KEY } from "../constants";
import '../styles/App.css';

class App extends React.Component {
    //pass the state and loginHandler to lower level by props: Main.js and Login.js
    state = {
        //!! turn it into boolean and get the !
        isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
    }

    handleLogin = (response) => {
        //use token_key to initialize the isLoggedIn
        localStorage.setItem(TOKEN_KEY, response);
        this.setState({isLoggedIn: true});
    }

    handleLogout = event => {
        event.preventDefault();
        localStorage.removeItem(TOKEN_KEY);
        this.setState({isLoggedIn: false});
    }

    render() {
        return (
            <div className="App">
                <Header isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout}/>
                <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin}/>
            </div>
        );
    }
}

export default App;
