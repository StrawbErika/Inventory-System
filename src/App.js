import logo from "./logo.svg";
import "./App.css";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import Admin from "./Pages/Admin/Admin";
import User from "./Pages/User/User";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import React, { useEffect, useState } from "react";
import { db } from "./db";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [userIsLoaded, setUserIsLoaded] = useState(false); //initialized, if nakuha na ung initial details
  const isLoggedIn = !!userDetails && userIsLoaded;
  const [error, setError] = useState(null);

  const returnUserType = async (user) => {
    if (user) {
      const docRef = db.collection("users").doc(user.uid);
      const doc = await docRef.get();
      if (doc.exists) {
        setUserDetails(doc.data());
      }
    }
  };

  const initializeUser = () => {
    async function run() {
      if (firebase.auth().currentUser) {
        await returnUserType(firebase.auth().currentUser);
        console.log("hello");
      }
      setUserIsLoaded(true);
    }
    run();
  };

  useEffect(initializeUser, []);

  const login = async (user) => {
    if (user) {
      try {
        const res = await firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.password);
        await returnUserType(res.user);
      } catch (error) {
        console.log(error.message);
        setError(error.message);
      }
    }
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? (
              userDetails.type === "admin" ? (
                <Redirect to="/admin" />
              ) : (
                <Redirect to="/user" />
              )
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            {isLoggedIn ? (
              userDetails.type === "admin" ? (
                <Redirect to="/admin" />
              ) : (
                <Redirect to="/user" />
              )
            ) : (
              <Login onLogin={login} error={error} />
            )}
          </Route>
          <Route exact path="/admin">
            {isLoggedIn && userDetails.type === "admin" ? (
              <Admin />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/user">
            {isLoggedIn && userDetails.type === "user" ? (
              <User user={userDetails} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
