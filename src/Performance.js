import React from 'react';
import "./css/Main.css";
import logo_full from './images/logo_full.png';

class Performance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {video_id:"", countdown:5, score:0, today:""}
    }

    parseToday = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        this.setState({today:today});
    }

    fetchVideo = () => {
        var group = this.props.location.state.selected_group;
        var song = this.props.location.state.selected_track;

        // Get cached copy or request YouTube API
        if(localStorage.getItem(group+song)) {
            console.log("Video id retrieved from local storage");
            this.setState({video_id:localStorage.getItem(group+song)})
        } else {
            console.log("Attempt to get video id for",group,song);

            fetch("/api/video/"+group+"/"+song)
            .then((response) => response.json())
            .then((data) => {
                console.log("data",data);
                if(data.video_id){
                    this.setState({video_id:data.video_id});
                    localStorage.setItem(group+song, data.video_id);
                } 
            });
        }        
    }

    fetchScore = () => {
        var info = 
            {
                track_id: this.props.location.state.track_id,
                singavg: this.props.location.state.singavg,
                rapavg: this.props.location.state.rapavg,
                danceavg: this.props.location.state.danceavg
            }

        fetch("/api/performance", 
        {method:"POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },body:JSON.stringify(info)})
        .then((response) => response.json())
        .then((data) => {
            if(data.score){
                this.setState({score:data.score});
            } 
        });
    }

    printGroupMembers = () => {
        return this.props.location.state.members.map((member) => {
            return(
            <tr key={member.member_id}>
                <td id="resultsMember">{member.stage_name} {member.group.includes("(Soloist)") ? "(Soloist)" : "from "+member.group}</td>
            </tr>
            )
        })
    }

    countdown = () => {
        var timer = setInterval( () => {
            this.setState({countdown:this.state.countdown-1});
        },1000)
        setTimeout( () => {
            clearInterval(timer);
            document.getElementById("resultsTitle").style.display = "block";
            document.getElementById("resultsText").style.display = "flex";
            document.getElementById("leaderboardButton").style.display = "block";
            document.getElementById("waitText").style.display = "none";
        }, 5000)
    }

    addLeaderboard = () => {
        var entry = {
            username: this.props.location.state.username,
            score: this.state.score,
            group_name: this.props.location.state.group_name,
            group_members: this.props.location.state.members,
            song: this.props.location.state.selected_group + " – " + this.props.location.state.selected_track,
            video_id: this.state.video_id,
            date: this.state.today
        }

        fetch("/api/leaderboard/new", 
        {method:"POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },body:JSON.stringify(entry)})
        .then((response) => response.json())
        .then((data) => {
            console.log(data, "added to leaderboard");
            alert("Your performance has been added to the leaderboard!");
            window.location.replace("/leaderboard");
        });
    }

    componentDidMount() {
        if(!sessionStorage.getItem("login") || !this.props.location.state) {
            alert("You must access this page from \"My Group\".");
            window.location.replace("/");
        }

        this.parseToday();
                
        document.getElementById("resultsTitle").style.display = "none";
        document.getElementById("resultsText").style.display = "none";
        document.getElementById("leaderboardButton").style.display = "none";
        // console.log(this.props.location.state);
        this.fetchVideo();
        this.fetchScore();
        this.countdown();
    }


    render() { 
        return (
        <div className="Main">
            <div className="results">
            <img className="logoFull" src={logo_full} height="100px"></img>
                <iframe className="ytplayer" 
                id="perfPlayer"
                type="text/html" 
                width="720" height="405"
                src={"https://www.youtube.com/embed/"+this.state.video_id+"?autoplay=1&modestbranding=1&color=white"}
                frameBorder="0" allowFullScreen>
                </iframe>
                <div id="resultsArea">
                    <h2 id="waitText">Filming... <br/>
                    [{this.state.countdown}]</h2>
                    <h2 id="resultsTitle">Great performance!</h2>
                    <button id="leaderboardButton" type="button" onClick={this.addLeaderboard}>Add to leaderboard</button>
                    <div id="resultsText">
                        <table id="resultsTable">
                            <tbody>
                            <tr><th>Score</th><td>{this.state.score.toLocaleString()}</td></tr>
                            <tr><th>Song</th><td>{this.props.location.state.selected_group} – {this.props.location.state.selected_track}</td></tr>
                            <tr><th>Date</th><td>{this.state.today}</td></tr>
                            <tr><th>Username</th><td>{sessionStorage.getItem("login")}</td></tr>
                            <tr><th>Group</th><td>{this.props.location.state.group_name}</td></tr>
                            
                            </tbody>
                        </table>
                        <table id="resultsMembers">
                            <tbody>
                                <tr><th>Members of {this.props.location.state.group_name}</th></tr>
                                {this.printGroupMembers()}
                            </tbody>
                        </table>   
                    </div>
                    
                </div>                
            </div>
        </div>
        )
    }
}

export default Performance;