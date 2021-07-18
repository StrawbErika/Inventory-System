import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import "firebase/auth";
import { BrowserRouter as Router, Link } from "react-router-dom";
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
      my={40}
    >
      <Box marginBottom={3} fontSize={20}>
        Login Here
      </Box>

      <Box display="flex" flexDirection="column" marginBottom={3}>
        <Box marginBottom={1}>
          <TextField
            label="Email"
            name="email"
            type="email"
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
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Login
      </Button>
      <Box marginTop={2}>
        <Link to="/signup"> Don't have an account?</Link>
      </Box>
    </Box>
  );
}
