import React from 'react';
import GroupSidebar from './GroupSidebar';
import logo_full from './images/logo_full.png';

class Search extends React.Component {

  render () { 
    return (
    <div className="Content">
        <GroupSidebar/>
        <img className="logoFull" src={logo_full}></img>
        <h1 className="idolName" id="searchText">Select an artist from the sidebar!</h1>
    </div>
    );
  };
}

export default Search;