import React from 'react';
import { Link } from 'react-router-dom';
import "./css/Main.css";

class MyGroup extends React.Component {
    constructor(props){
        super(props);
        this.state = {username:"", members:[], group_name:"", singavg:0,rapavg:0,danceavg:0}
    }

    loggedIn = () => {
        if(sessionStorage.getItem("login") === this.state.username){
        return true;
        } else return false;
    }

    roundToTwo(num) {    
        return +(Math.round(num + "e+2")  + "e-2");
    }

    userButtons = () => {
        if(sessionStorage.getItem("login") && this.state.members.length > 0) {
        document.getElementById("perflink").style.display = "inline-block";
        document.getElementById("namelink").style.display = "inline-block";
        } else {
        document.getElementById("perflink").style.display = "none";
        document.getElementById("namelink").style.display = "none";
        }
    }

    fetchMyGroup = () => {
        var username = this.props.match.params.username;

        // Get group name from profile
        fetch("/api/profile/"+username)
            .then((response) => response.json())
            .then((data) => {
                if(data[0]){
                    this.setState({group_name:data[0].group_name});
                } else {
                    this.setState({group_name:username+"'s Group"});
                }
            })
        
        // Get members in group
        this.setState({username:username});
        fetch("/api/"+username+"/mygroup")
        .then((response) => response.json())
        .then((data) => {
            this.setState({members:data}); 
            this.calcAverages();
            this.userButtons();       
        });

        // Group is empty
        document.getElementById("perflink").style.display = "none";
        
    }
    
    calcAverages = () => {
        var member;
        var memtotal = this.state.members.length;
        var singtotal = 0;
        var raptotal = 0;
        var dancetotal = 0;
        for(var i=0; i<memtotal; i++) {
        member = this.state.members[i];
        singtotal += member.sing;
        raptotal += member.rap;
        dancetotal += member.dance;
        }

        var singavg = this.roundToTwo(singtotal/memtotal);
        var rapavg = this.roundToTwo(raptotal/memtotal);
        var danceavg = this.roundToTwo(dancetotal/memtotal);

        this.setState({singavg:singavg,rapavg:rapavg,danceavg:danceavg});
    }

    removeMember = (id) => {
        if(!sessionStorage.getItem("login")){
            alert("An error occurred.");
        } else {
            var removeMember = {username:sessionStorage.getItem("login"),member:id};
            fetch("/api/remove", 
            {method:"POST", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },body:JSON.stringify(removeMember)})
            .then((response) => response.json())
            .then((data) => {
                if(data[0]){
                    alert(removeMember.member+" removed from "+removeMember.username+"'s group.");
                    window.location.reload();
                } else {
                    alert("An error occurred.");
                }
            });
        }
        }


    printHeader = () => {
        if(this.loggedIn){
            return (
                <tr className="mgRowHeader">
                <th className="mgHeader1">Member</th><th className="mgHeader">Original Group</th><th className="mgHeader">Singing</th><th className="mgHeader">Rapping</th><th className="mgHeader">Dancing</th><th className="mgHeader2"></th>
                </tr>
            )
        } else {
            return (
                <tr className="mgRowHeader">
                <th className="mgHeader1">Member</th><th className="mgHeader">Original Group</th><th className="mgHeader">Singing</th><th className="mgHeader">Rapping</th><th className="mgHeader2">Dancing</th>
                </tr>
            )
        }
    }

    printMembersList = () => {
        if(this.loggedIn){
        // Include button to remove if logged in to this account
        console.log(this.state.members);
            return this.state.members.map(member => (
                <tr className="mgrow" key={member.stage_name}>
                    <td className="mginfo1"><Link to={"/groups/"+member.group+"/members/"+member.stage_name}>{member.stage_name}</Link></td>
                    <td className="mginfo"><Link to={"/groups/"+member.group}>{member.group}</Link></td>
                    <td className="mginfo">{member.sing}</td>
                    <td className="mginfo">{member.rap}</td>
                    <td className="mginfo">{member.dance}</td>            
                    <td className="mginfo2"><button onClick={this.removeMember.bind(this,member.member_id)}>Remove</button></td>
                </tr>
            ))  
            } else {
            // Do not include button if not logged in to this account
            return this.state.members.map(member => (
                <tr className="mgrow" key={member.stage_name}>
                    <td className="mginfo1"><Link to={"/groups/"+member.group+"/members/"+member.stage_name}>{member.stage_name}</Link></td>
                    <td className="mginfo"><Link to={"/groups/"+member.group}>{member.group}</Link></td>
                    <td className="mginfo">{member.sing}</td>
                    <td className="mginfo">{member.rap}</td>
                    <td className="mginfo2">{member.dance}</td>
                </tr>
            ))  
            }
                
        
    }

    componentDidMount() {
        this.fetchMyGroup();
    }
        

    componentDidUpdate(prevProps) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
        this.fetchMyGroup();
        }
    }

    render () { 
        var perfLink = {
            pathname: "/perform",
            state: this.state
        }
        return (
        <div className="Main">
            <div className="mygroupDetails">
                <h1 id="groupName">{this.state.group_name}</h1> 
                <h3>{this.state.username} Entertainment</h3>
                {this.state.members.length} members
            </div>
            <hr/>
            <p className="mgstats">
                Singing: {this.state.singavg} | Rapping: {this.state.rapavg} | Dancing: {this.state.danceavg}
                <br/>
                <Link id="perflink" className="perflink" to={perfLink}>{">> Perform <<"}</Link>
                <br/>
                <small><Link id="namelink" className="splink" to="/edit">Change group name</Link></small>
            </p>
            <hr/>
            <table className="mygroupTable">
            <tbody>
                {this.printHeader()}
                {this.printMembersList()}
            </tbody>
            </table>        
        </div>
        );
    };
}

export default MyGroup;
