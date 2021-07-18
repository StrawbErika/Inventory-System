import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import "firebase/auth";

export default function Login({ onLogin, error }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleFieldChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onLogin(user);
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
