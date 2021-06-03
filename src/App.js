import { Route, Switch, Redirect } from "react-router-dom";

import Homepage from "./Homepage";

function App() {
    function isloggedIn() {
        return sessionStorage.getItem("login") ? true : false;
    }

    return (
        <main>
            <Switch> 
                <Route exact path="/" component={Homepage}/>
            </Switch>
        </main>
    )
    
}

export default App;