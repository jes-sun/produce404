import React from 'react';
import './css/Main.css';

class Register extends React.Component {
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

    register = (event) => {
        event.preventDefault();
        if(this.state.username !== "" && this.state.password !== ""){ 
            var userLogin = {username:this.state.username,password:this.state.password};
            fetch("/api/register", 
            {method:"POST", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },body:JSON.stringify(userLogin)})
            .then(response => response.json())
            .then(data => {
                if(data[0]) {
                    alert("Registration successful! Please log in.");
                    window.location.replace("/login");
                } else {
                    alert("Username is already taken.");
                }
                
            })
        } else {
            alert("Please enter a username and password.");
        }
    }

    render() {
        return (
            <div className="Main">
                <h1 className="idolName">Register</h1>
                <form onSubmit={this.register}>
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
                                <td></td><td><input id="submit" type="submit" value="Register"></input></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                
            </div>
        )
    }


}

export default Register;
