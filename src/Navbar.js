import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';
import logo_horizontal from './images/logo_horizontal.png'

class Navbar extends React.Component {
     constructor(props) {
         super(props);
         this.state = {username:""};
     }

    logOut() {
        if(sessionStorage.getItem("login")){
            sessionStorage.removeItem("login");
            alert("You have been logged out.");
            window.location.replace("/");
        } else {
            alert("You are not logged in!");
        }
        
    }

    componentDidMount() {
        if(sessionStorage.getItem("login")) {
            this.setState({username:sessionStorage.getItem("login")});
            document.getElementById("logout").style.display = "inline-block";
            document.getElementById("login").style.display = "none";
        } else {
            document.getElementById("logout").style.display = "none";
            document.getElementById("login").style.display = "inline-block";
        }
    }

    render() {
        return (
            <nav className="Navbar">
                <li className="title"><Link className="titleLink" to="/"><img src={logo_horizontal} height="40px" alt="Produce 404"></img></Link></li>
                <ul className="NavbarItems">                                  
                    <li className="navitem"><Link to="/mygroup">My Group</Link></li>
                    <li className="navitem"><Link to="/groups/">Idols</Link></li>
                    <li className="navitem"><Link to="/profile">Profiles</Link></li>
                    <li className="navitem"><Link to="/leaderboard">Leaderboard</Link></li>                  
                    <li className="navitem" id="logout"><a onClick={this.logOut}>Log Out ({this.state.username})</a></li>
                    <li className="navitem" id="login"><Link to="/login">Log In</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;