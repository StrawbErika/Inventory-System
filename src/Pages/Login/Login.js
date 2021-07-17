import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../db";
import firebase from "firebase/app";
import "firebase/auth";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    error: "",
  });

  const handleFieldChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  const handleSubmit = async () => {
    if (user) {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.password);
        // console.log(loggedIn ? true : false);
        console.log("no error");
      } catch (error) {
        console.log("error!");
        console.log(error.message);
        setUser({
          ...user,
          error: error.message,
        });
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      Login Here{" "}
      <Box width="20%" display="flex" flexDirection="column">
        <TextField
          label="Email"
          name="email"
          type="email"
          onChange={handleFieldChange}
          variant="outlined"
        />
        <TextField
          label="Password"
          name="password"
          onChange={handleFieldChange}
          variant="outlined"
          type="password"
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
