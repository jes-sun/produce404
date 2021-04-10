import React from 'react';
import GroupSidebar from './GroupSidebar';
import "./css/Content.css";

class Member extends React.Component {
    constructor(props) {
      super(props);
      this.state = {member_id:"",group:"",stage_name:"",last_name:"",first_name:"",year:0,nationality:"",sing:0,rap:0,dance:0};
    }

    fetchMemberInfo = () => {
        var group = this.props.match.params.group;
        var member = this.props.match.params.member;
        fetch("/api/groups/"+group+"/members/"+member)
        .then((response) => response.json())
        .then((data) => {
            this.setState({member_id:data[0].member_id,group:data[0].group,stage_name:data[0].stage_name,last_name:data[0].last_name,first_name:data[0].first_name,year:data[0].year,nationality:data[0].nationality,sing:data[0].sing,rap:data[0].rap,dance:data[0].dance});
        });
    }

    isSoloist = () => {
        return this.state.group.includes("(Soloist)");
    }

    componentDidMount() {
        this.fetchMemberInfo();
    }

    addMember = (event) => {
        event.preventDefault();
        if(!sessionStorage.getItem("login")){
            alert("You must be logged in to perform this action.");
            window.location.replace("/login");
        } else {
            var addMember = {username:sessionStorage.getItem("login"),member:this.state.member_id};
            fetch("/api/add", 
            {method:"POST", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },body:JSON.stringify(addMember)})
            .then((response) => response.json())
            .then((data) => {
                console.log("data",data);
                if(data[0]){
                    alert(addMember.member+" added to "+addMember.username+"'s group.");
                    window.location.replace("/groups/"+this.state.group);
                } else {
                    alert("Member already in "+addMember.username+"'s group!");
                }
            
        });
        }
    }

    render() {
        return (
            <div className="Content">
                <GroupSidebar/>
                <h1 className="idolName">{this.state.stage_name} {this.isSoloist() ? "(Soloist)" : "("+this.state.group+")"}</h1>
                <table className="memberTable">
                    <tbody>
                        <tr><th className="meminfo">Full Name</th><td>{this.state.first_name} {this.state.last_name}</td></tr>
                        <tr><th className="meminfo">Birth Year</th><td>{this.state.year}</td></tr>
                        <tr><th className="meminfo">Korean Age</th><td>{new Date().getFullYear() - this.state.year + 1}</td></tr>
                        <tr><th className="meminfo">Nationality</th><td>{this.state.nationality}</td></tr>
                    </tbody>
                </table>
                <p id="bottomButtons">
                <button onClick={this.addMember}>Add to group</button>
                <br/>
                <small>(ID: {this.state.member_id})</small>
                </p>
            </div>
            );
        };
}

export default Member;
  