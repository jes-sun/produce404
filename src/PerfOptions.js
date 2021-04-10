import React from 'react';
import "./css/Main.css";
import SongOptions from "./SongOptions";

class PerfOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {groups: [], selected_group: "", track_id: ""}
    }

    getGroupOptions = () => {
        var og_groups = [""];
        this.props.location.state.members.forEach(member => {
            if(!og_groups.includes(member.group)) {
                og_groups.push(member.group);
            }
        })
        this.setState({groups:og_groups});
    }

    htmlGroupOptions = () => {
        var options = [];
        this.state.groups.forEach(group => {
            options.push(
                <option key={group} name={group}>{group}</option>
            )
        })
        return options;
    }

    fetchSongOptions = () => {
        if(this.state.selected_group !== "") {
            console.log("fetched", this.state.selected_group);
            fetch("/api/tracks/"+this.state.selected_group)
            .then((response) => response.json())
            .then((data) => {
                this.setState({song_options:data});
            })
        }
    }

    printSongOptions = () => {
        if(this.state.song_options.length > 0){
            console.log("please print",this.state.song_options);
            return (
                this.state.song_options.map((song => (
                    <li key={song.id}>{song.name}</li>
                )))
            )
        }
        
    }

    groupSelected = (event) => {
        this.setState({selected_group:event.target.value});
    }
    
    componentDidMount() {
        if(!sessionStorage.getItem("login") || !this.props.location.state) {
            alert("You must access this page from \"My Group\".");
            window.location.replace("/");
        } else {
            this.getGroupOptions();
        }
        
    }


    render () { 
        return (
        <div className="Main">
            <h1 id="perfSetup">Set up your performance!</h1>
            <div id="groupOptions" className="groupOptions">
                <label htmlFor="groupOptionsDropdown">Choose a group: </label>
                <select id="groupOptionsDropdown" onChange={this.groupSelected}>
                    {this.htmlGroupOptions()}
                </select>
            </div>

            <hr/>
            
            <SongOptions 
            group_name={this.props.location.state.group_name} 
            members={this.props.location.state.members} 
            singavg={this.props.location.state.singavg}
            rapavg={this.props.location.state.rapavg}
            danceavg={this.props.location.state.danceavg} 
            selected_group={this.state.selected_group}
            />
            
        </div>
        );
    };
}

export default PerfOptions;