import logo from "./logo.svg";
import "./App.css";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

function App() {
  const loggedIn = firebase.auth().currentUser;

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {loggedIn ? <div>sign up</div> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
