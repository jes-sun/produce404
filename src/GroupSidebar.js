import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';

class GroupSidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {groups: []}
  }

  componentDidMount() {
    fetch("/api/groups/all")
      .then((response) => response.json())
      .then((data) => {
      this.setState({groups: data.map(x => x.group_name)});
    });
  }

  render () { 
    return (
        <ul className="sidebar">
          <li className="sidebarli"><h2>Idols</h2></li>
          {this.state.groups.map(group => <li className="sidebarli" key={group}><Link to={"/groups/"+group}>{group}</Link></li>)}
        </ul>
    );
  };
}

export default GroupSidebar;