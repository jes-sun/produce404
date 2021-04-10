import React from 'react';
import GroupSidebar from './GroupSidebar';
import { Link } from 'react-router-dom';
import "./css/Content.css";

class Group extends React.Component {
  constructor(props){
    super(props);
    this.state = {group_name: "", company: "", members:[], song_options:[]}
  }

fetchGroup = () => {
var group = this.props.match.params.group_name;
fetch("/api/groups/"+group)
.then((response) => response.json())
.then((data) => {
    this.setState({group_name: data[0].group_name, company: data[0].company});
    this.fetchSongOptions();
});
fetch("/api/groups/"+group+"/members")
.then((response) => response.json())
.then((data) => {
    this.setState({members: data.map(x => x.stage_name)})
    console.log(this.state.members);
})
}

fetchSongOptions = () => {
if(this.state.group_name !== "") {
    fetch("/api/tracks/"+this.state.group_name)
    .then((response) => response.json())
    .then((data) => {
        this.setState({song_options:data});
    })
}
}

printSongOptions = () => {
    if(this.state.song_options.length > 0){
        return (
            this.state.song_options.map((song => (
                <li className="songOption" key={song.id}>
                    <button disabled type="button" className="songOptionPreviewButton">
                        <img className="songOptionImg" src={song.imageurl} alt={song.album}/>
                        <br/>
                        <label htmlFor="songOptionImg" id="songOptionLabel">{song.name}</label>
                    </button>
                </li>
            )))
        )
    }
    
}

  isSoloist = () => {
    return this.state.group.includes("(Soloist)");
  }

  componentDidMount() {
    if(this.isSoloist) document.getElementById("membersList").style.columns = "1";
    this.fetchGroup();
  }
    

  componentDidUpdate(prevProps) {
    if (this.props.match.params.group_name !== prevProps.match.params.group_name) {
        this.fetchGroup();
    }
  }

  render () { 
    return (
    <div className="Content">
        <GroupSidebar/>
        <div id="groupInfo">
            <h1 className="idolName">{this.state.group_name}</h1>
            <h3 className="company">{this.state.company}</h3>
        </div>
        
        <hr/>
        <ul className="membersList" id="membersList">
        {this.state.members.map(member => <li className="memberli" key={member}><Link to={"/groups/"+this.state.group_name+"/members/"+member}>{member}</Link></li>)}
        </ul>
        <hr/>
        <div id="songOptionsPreview">
            <h3 className="company">Songs</h3>
            <ul className="songOptionsList">
                {this.printSongOptions()}
            </ul>
            
        </div>
        
    </div>
    );
  };
}

export default Group;
