import React from 'react';
import './css/Content.css';
import { Link } from 'react-router-dom';
import UserSidebar from './UserSidebar';

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state= {username:"",group_name:"",name:"",location:"",bio:""}
    }

    fetchProfile = () => {
        var username = this.props.match.params.username;

        if(sessionStorage.getItem("login") !== username) {
            document.getElementById("edit").style.display = "none";
            document.getElementById("deleteAcc").style.display = "none";
        } else {
            document.getElementById("edit").style.display = "block";
            document.getElementById("deleteAcc").style.display = "block";
        }

        fetch("/api/profile/"+username)
        .then((response) => response.json())
        .then((data) => {
            if(data[0]){
                this.setState({username:data[0].username,group_name:data[0].group_name,name:data[0].name,location:data[0].location,bio:data[0].bio});
            } else {
                this.setState({username:"User Not Found"});
            }
            
        })
    }

    deleteAccount = () => {
        var deleteUser = {username:this.state.username};
        if(window.confirm("Are you sure you want to delete account "+deleteUser.username+"?")) {
            fetch("/api/deleteaccount", 
            {method:"POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },body:JSON.stringify(deleteUser)})
        .then((response) => response.json())
        .then((data) => {
            console.log("data",data);
            if(data){
                alert("You have deleted your account.");
                sessionStorage.removeItem("login");
                window.location.replace("/");
            } else {
                alert("An error occurred.");
            }
          });
        } else {
            //
        }
    }

    componentDidMount() {
        this.fetchProfile();        
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
          this.fetchProfile();
        }
      }

    render() {
        return (
            <div className="Content">
                <UserSidebar/>
                <h1 className="idolName">{this.state.username}</h1>
                <table className="memberTable">
                    <tbody>
                        <tr><th>Group</th><td><Link to={"/"+this.state.username+"/mygroup"}>{this.state.group_name}</Link></td></tr>
                        <tr><th>Name</th><td>{this.state.name}</td></tr>
                        <tr><th>Location</th><td>{this.state.location}</td></tr>
                        <tr><th>Bio</th><td>{this.state.bio}</td></tr>
                    </tbody>
                </table>
                <p id="bottomButtons">
                <Link id="edit" className="splink" to="/edit">Edit Profile</Link>
                <br/>
                <button id="deleteAcc" onClick={this.deleteAccount}>Delete Account</button>
                </p>
            </div>
        )
    }
}

export default Profile;