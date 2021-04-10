import React from 'react';
import { Link } from 'react-router-dom';
import "./css/Main.css";

class SongOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: "", song_options: [], selected_track: "", selected_name: ""}
    }

    fetchSongOptions = () => {
        if(this.props.selected_group !== "") {
            console.log("fetched", this.props.selected_group);
            fetch("/api/tracks/"+this.props.selected_group)
            .then((response) => response.json())
            .then((data) => {
                this.setState({song_options:data});
            })
        }
    }

    printSongOptions = () => {
        if(this.state.song_options.length > 0){
            document.getElementById("songOptionsListLabel").style.display = "block";
            return (
                this.state.song_options.map((song => (
                    <li className="songOption" key={song.id}>
                        <button type="button" id={song.id} className="songOptionButton" onClick={this.songSelected.bind(this,song.id, song.name)}>
                            <img className="songOptionImg" src={song.imageurl} alt={song.album}/>
                            <br/>
                            <label htmlFor="songOptionImg" id="songOptionLabel">{song.name}</label>
                        </button>
                    </li>
                )))
            )
        }
        
    }

    songSelected = (track_id, track_name) => {
        // Return previously selected button back to normal
        if(document.getElementById(this.state.selected_track)){
            document.getElementById(this.state.selected_track).style.borderWidth = "medium";
            document.getElementById(this.state.selected_track).style.borderColor = "pink";
        }

        document.getElementById("final").style.display = "block";
        
        // Highlight newly selected button
        this.setState({selected_track:track_id});
        this.setState({selected_name:track_name});
        document.getElementById(track_id).style.borderWidth = "thick";
        document.getElementById(track_id).style.borderColor = "black";
    }
        
    componentDidMount() {
        this.setState({username:sessionStorage.getItem("login")});
        this.fetchSongOptions();
        document.getElementById("songOptionsListLabel").style.display = "none";
        document.getElementById("final").style.display = "none";
    }

    componentDidUpdate(prevProps) {
        if (this.props.selected_group !== prevProps.selected_group) {
          this.fetchSongOptions();
        }
      }


    render () { 
        var goLink = {
            pathname:"/perform/go",
            state: {
                username:this.state.username,
                group_name:this.props.group_name,
                members:this.props.members,
                singavg:this.props.singavg,
                rapavg:this.props.rapavg,
                danceavg:this.props.danceavg, 
                selected_group:this.props.selected_group,
                selected_track:this.state.selected_name,
                track_id:this.state.selected_track,
            }
        }
        return (
            <>
            <div id="songOptions" className="songOptions">
                <label id="songOptionsListLabel" htmlFor="songOptionsList">Choose a song:</label>
                <ul className="songOptionsList">
                    {this.printSongOptions()}
                </ul> 
            </div>
            <hr/>
            <div id="final">
                <p id="perfAnnouncement">
                    {this.state.username}'s group {this.props.group_name} will be performing {this.props.selected_group}'s {this.state.selected_name}!
                    <br/>
                    <Link to={goLink}><button type="button" id="goButton">Let's do it!</button></Link>
                </p>
                
            </div>
            </>
        );
    };
}

export default SongOptions;