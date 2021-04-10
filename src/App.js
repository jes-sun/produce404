import React from 'react';
import './css/App.css';
import Navbar from './Navbar';
import Homepage from './Homepage';
import Login from './Login';
import Register from './Register';
import Group from './Group';
import Member from './Member';
import Search from './Search';
import Profile from './Profile';
import Edit from './Edit';
import MyGroup from './MyGroup';
import PerfOptions from './PerfOptions';
import Performance from './Performance';
import Leaderboard from './Leaderboard';

import { Route, Switch, Redirect } from 'react-router-dom';

class App extends React.Component {
    loggedIn() {
        if(sessionStorage.getItem("login")) {
            return true;
        } else return false;
    }

    render() {
        return (
            <main>
                <Navbar/>
                <Switch> 
                    <Route exact path="/">
                        <Redirect to="/home"/>
                    </Route>
                    <Route path="/home" component={Homepage} exact />
                    <Route path="/login" component={Login} exact />
                    <Route path="/register" component={Register} exact />                                          
                    <Route exact path="/profile">
                        {this.loggedIn() ? <Redirect to={"/profile/"+sessionStorage.getItem("login")}/> : <Redirect to="/login"/>}
                    </Route>
                    <Route exact path="/mygroup">
                        {this.loggedIn() ? <Redirect to={"/"+sessionStorage.getItem("login")+"/mygroup"}/> : <Redirect to="/login"/>}
                    </Route>
                    <Route path="/profile/:username" component={Profile} exact />   
                    <Route path="/:username/mygroup" component={MyGroup} exact />
                    <Route path="/edit" component={Edit} exact />                
                    <Route path="/groups/" component={Search} exact/> 
                    <Route path="/groups/:group_name" component={Group} exact/> 
                    <Route path="/groups/:group/members/:member" component={Member} exact/>
                    <Route path="/perform" component={PerfOptions} exact />
                    <Route path="/perform/go" component={Performance} exact />
                    <Route path="/leaderboard" component={Leaderboard} exact />
                </Switch>
            </main>
        )
    }
}

export default App;