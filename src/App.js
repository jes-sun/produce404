import { Route, Switch, Redirect } from "react-router-dom";

import MyNavbar from "./MyNavbar";
import Homepage from "./Homepage";
import Register from "./Register";

function App() {
    function isloggedIn() {
        return sessionStorage.getItem("login") ? true : false;
    }

    return (
        <main>
            <MyNavbar/>
            <Switch> 
                <Route exact path="/" component={Homepage}/>
                <Route exact path="/register" component={Register}/>
            </Switch>
        </main>
    )
    
}

export default App;