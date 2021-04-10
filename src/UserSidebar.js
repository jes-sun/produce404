import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';

class UserSidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {users: []}
  }

  componentDidMount() {
    fetch("/api/userlist")
      .then((response) => response.json())
      .then((data) => {
      this.setState({users: data.map(x => x.username)});
    });
  }

  render () { 
    return (
        <ul className="sidebar">
          <li className="sidebarli"><h2>Users</h2></li>
          {this.state.users.map(user => <li className="sidebarli" key={user}><Link to={"/profile/"+user}>{user}</Link></li>)}
        </ul>
    );
  };
}

export default UserSidebar;