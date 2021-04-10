import React from 'react';
import './css/Main.css';
import logo_full from './images/logo_full.png';
import { Link } from 'react-router-dom';

class Homepage extends React.Component {

  render () { 
    return (
    <div className="Main">
        <img className="logoFull" src={logo_full} height="100px"></img>
        <iframe className="ytplayer"
        id="LBytplayer" 
        type="text/html" 
        width="720" height="405"
        src={"https://www.youtube.com/embed/M3rg-rh6MPo?autoplay=1&modestbranding=1&color=white"}
        frameBorder="0" allowFullScreen>
        </iframe>
        <h1 className="idolName">Build your group!</h1>
        <div className="homepageText">
        <p>
            Stop arguing with people online. Simply prove you're objectively better at being a K-pop fan by beating them at this game.
        </p>
        <ol id="homepageList">
            <li className="homepageListItem">Select your favourite idols</li>
            <li className="homepageListItem">Choose a song to cover</li>
            <li className="homepageListItem"><Link to="/mygroup" className="slink">Perform!</Link></li>
        </ol>
        <p>
            The #1 song on the leaderboard gets automatic YouTube Player privileges!
        </p>
        <p>
            And bragging rights, I guess, if you think that would be an accomplishment worth bragging about.
        </p>
        </div>
    </div>
    );
  };
}

export default Homepage;