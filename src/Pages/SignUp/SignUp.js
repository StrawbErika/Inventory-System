import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { useHistory, Link } from "react-router-dom";

export default function SignUp() {
  let history = useHistory();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    type: "admin",
    error: "",
  });

  const handleUserType = (e) => {
    setUser({
      ...user,
      type: e.target.value,
      error: "",
    });
  };

  const handleFieldChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: "",
    });
  };
  // TODO: snackbar feedback
  const handleSubmit = async () => {
    try {
      const createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);

      createdUser.user.updateProfile({
        displayName: user.name,
        type: user.type,
      });

      await db.collection("users").doc(createdUser.user.uid).set({
        id: createdUser.user.uid,
        email: user.email,
        displayName: user.name,
        type: user.type,
      });
      history.push("/login");
    } catch (error) {
      console.log("error!");
      console.error(error);
      setUser({
        ...user,
        error: error.message,
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      my={35}
    >
      <Box marginBottom={3} fontSize={20}>
        Signup here
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom={1}
      >
        <Box marginBottom={1}>
          <TextField
            label="Email"
            name="email"
            type="email"
            onChange={handleFieldChange}
            variant="outlined"
          />
        </Box>
        <Box marginBottom={1}>
          <TextField
            label="User Name"
            name="name"
            onChange={handleFieldChange}
            variant="outlined"
          />
        </Box>
        <Box>
          <TextField
            label="Password"
            name="password"
            onChange={handleFieldChange}
            variant="outlined"
            type="password"
          />
        </Box>

        <Box display="flex" flexDirection="row" alignItems="center">
          <Radio
            checked={user.type === "admin"}
            onChange={handleUserType}
            value="admin"
            name="radio-button-demo"
            inputProps={{ "aria-label": "Admin" }}
          />
          Admin
          <Radio
            checked={user.type === "user"}
            onChange={handleUserType}
            value="user"
            name="radio-button-demo"
            inputProps={{ "aria-label": "User" }}
          />
          User
        </Box>
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Sign Up
      </Button>

      <Box marginTop={2}>
        <Link to="/login"> Already have an account?</Link>
      </Box>
    </Box>
  );
}
