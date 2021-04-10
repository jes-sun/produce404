import React from 'react';
import './css/Main.css';

class Edit extends React.Component {
    constructor(props){
        super(props);
        this.state= {username:"",group_name:"",name:"",location:"",bio:""}
    }

    fetchProfile = () => {
        if(sessionStorage.getItem("login")) {
            fetch("/api/profile/"+sessionStorage.getItem("login"))
            .then((response) => response.json())
            .then((data) => {
                if(data[0]){
                    this.setState({username:data[0].username,group_name:data[0].group_name,name:data[0].name,location:data[0].location,bio:data[0].bio});
                } else {
                    alert("An error has occurred.");
                    window.location.replace("/");
                }
            })
        } else {
            alert("Please log in.")
            window.location.replace("/");
        }

        
    }

    componentDidMount() {
        this.fetchProfile();        
    }

    groupNameChange = (event) => {
        this.setState({group_name:event.target.value});
    }

    nameChange = (event) => {
        this.setState({name:event.target.value});
    }
    locationChange = (event) => {
        this.setState({location:event.target.value});
    }
    bioChange = (event) => {
        this.setState({bio:event.target.value});
    }

    submitChanges = (event) => {
        event.preventDefault();
        if(this.state.group_name !== "" && this.state.name !== "" && this.state.location !== "" && this.state.bio !== "") {
            var newProfile = {username:this.state.username,group_name:this.state.group_name,name:this.state.name,location:this.state.location,bio:this.state.bio};
            fetch("/api/edit", 
            {method:"POST", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },body:JSON.stringify(newProfile)})
            .then(response => response.json())
            .then(data => {
                console.log("data: "+data);
                if(data.result.ok === 1) {
                    alert("Profile updated.");
                    window.location.replace("/profile");
                } else {
                    alert("An error occurred.");
                }
                
            })
        } else {
            alert("All fields require a value.")
        }
    }

    render() {
        return (
            <div className="Main">
                <h1 className="idolName">{this.state.username}</h1>
                <form onSubmit={this.submitChanges}>
                    <table className="memberTable">
                        <tbody>
                        <tr><th>Group Name</th><td><input id="groupName" autoComplete="name" value={this.state.group_name} onChange={this.groupNameChange}></input></td></tr>
                            <tr><th>Name</th><td><input id="name" autoComplete="name" value={this.state.name} onChange={this.nameChange}></input></td></tr>
                            <tr><th>Location</th><td><input id="location" autoComplete="country" value={this.state.location} onChange={this.locationChange}></input></td></tr>
                            <tr><th>Bio</th><td><textarea id="bio" value={this.state.bio} onChange={this.bioChange}></textarea></td></tr>
                            <tr><td></td><td id="editInput"><input id="editInputButton" type="submit" value="Submit changes"></input></td></tr>
                        </tbody>
                    </table>
                </form>
                <br/>
            </div>
        )
    }
}

export default Edit;