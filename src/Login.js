import React from 'react';
import './css/Main.css';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username:"",password:""};

    }

    usernameChange = (event) => {
        this.setState({username:event.target.value});
    }
    passwordChange = (event) => {
        this.setState({password:event.target.value});
    }

    login = (event) => {
        event.preventDefault();
        if(this.state.username !== "" && this.state.password !== ""){ 
            var userLogin = {username:this.state.username,password:this.state.password};
            fetch("/api/login", 
            {method:"POST", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },body:JSON.stringify(userLogin)})
            .then(response => response.json())
            .then(data => {
                if(data[0]) {
                    alert("Login successful.");
                    sessionStorage.setItem("login", this.state.username);
                    window.location.replace("/home");
                } else {
                    alert("Login failed. Please try again.");
                }
                
            })
        } else {
            alert("Please enter a username and password.");
        }
    }

    registerPage = (event) => {
        event.preventDefault();
        window.location.replace("/register");
    }

    render() {
        return (
            <div className="Main">
                <h1 className="idolName">Login</h1>
                <form onSubmit={this.login}>
                    <table className="memberTable">
                        <tbody>
                            <tr>
                                <td><label htmlFor="username">Username</label></td>
                                <td><input id="username" autoComplete="username" value={this.state.username} onChange={this.usernameChange}></input></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="password">Password</label></td>
                                <td><input id="password" type="password" autoComplete="current-password" value={this.state.password} onChange={this.passwordChange}></input></td>
                            </tr>
                            <tr>
                                <td></td><td><input id="submit" type="submit" value="Login"></input></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <p id="bottomButtons">
                Don't have an account? Click <Link className="splink" to="/register">here</Link> to register.
                </p>
            </div>
        )
    }


}

export default Login;