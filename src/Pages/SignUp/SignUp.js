import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../db";
import firebase from "firebase/app";
import "firebase/auth";

export default function SignUp() {
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

  const handleSubmit = async () => {
    try {
      const createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);

      createdUser.user.updateProfile({
        name: user.name,
      });

      await db.collection("users").doc(createdUser.user.uid).set({
        id: createdUser.user.uid,
        email: user.email,
        name: user.name,
        type: user.type,
      });
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
    >
      Signup here
      <Box width="20%" display="flex" flexDirection="column">
        <TextField
          label="Email"
          name="email"
          type="email"
          onChange={handleFieldChange}
          variant="outlined"
        />
        <TextField
          label="User Name"
          name="name"
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
        Submit
      </Button>
    </Box>
  );
}
