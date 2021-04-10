import React from 'react';
import "./css/Main.css";
import { Link } from 'react-router-dom';
import logo_full from './images/logo_full.png';

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entries: [], currently_playing: "" }
    }

    fetchLeaderboard = () => {
        fetch("/api/leaderboard")
            .then((response) => response.json())
            .then((data) => {
                console.log("data",data);
                if(data[0]){
                    this.setState({entries:data, currently_playing:data[0].video_id});
                    localStorage.setItem("LBsong", data[0].video_id);
                } 
            });
    }

    setInitialSong = () => {
        if(localStorage.getItem("LBsong")){
            this.setState({currently_playing:sessionStorage.getItem("LBSong")});
        } else {
            this.setState({currently_playing:"M3rg-rh6MPo"})
        }
        
    }

    printEntries = () => {
        return this.state.entries.map((entry, i) => {
            return (
                <tr className="LBRow" key={entry._id}>
                    <td className="LBNum"><h1 className="LBNum">{i+1}</h1></td>
                    <td className="LBScore">{entry.score.toLocaleString()}</td>
                    <td className="LBEntry"><Link title="Visit profile" to={"/profile/"+entry.username}>{entry.username}</Link></td>
                    <td className="LBEntry">{entry.group_name}</td>
                    <td className="LBEntry">
                        <div className="LBMembers">
                        {this.printMembers(entry.group_members)}
                        </div>
                    </td>
                    <td className="LBEntry">
                        <span className="slink" title="Play song" onClick={this.changeCurrentSong.bind(this, entry.video_id)}>{entry.song}</span>
                    </td>
                    <td className="LBDate">{entry.date}</td>    
                </tr>
            )
        })
    }

    printMembers = (members) => {
        return members.map((member) => {
            return (
                <>
                <Link to={"/groups/"+member.group+"/members/"+member.stage_name}>{member.stage_name}</Link>
                <br/>
                </>
            )
        })
    }

    changeCurrentSong = (video_id) => {
        this.setState({currently_playing:video_id});
    }

    componentDidMount() {
        this.setInitialSong();
        this.fetchLeaderboard();
    }

    render() {
        return (
            <div className="Main">
                <img className="logoFull" src={logo_full} height="100px"></img>
                <iframe className="ytplayer"
                id="LBytplayer" 
                type="text/html" 
                width="720" height="405"
                src={"https://www.youtube.com/embed/"+this.state.currently_playing+"?autoplay=1&modestbranding=1&color=white"}
                frameBorder="0" allowFullScreen>
                </iframe>
                <div className="LBDiv">
                    <table className="LBTable">
                        <thead>
                            <tr className="LBRowHeader">
                                <th className="LBHeader1"></th>
                                <th className="LBHeader">Score</th>
                                <th className="LBHeader">User</th>
                                <th className="LBHeader">Group</th>
                                <th className="LBHeader">Members</th>
                                <th className="LBHeader">Song</th>
                                <th className="LBHeader2">Date</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {this.printEntries()}
                        </tbody>
                    </table>
                </div>
            </div>
            
        
        )
    }

}

export default Leaderboard;