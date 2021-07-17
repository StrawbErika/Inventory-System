import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../db";
import "firebase/auth";
import AddItem from "./Components/AddItem/AddItem";

export default function Admin() {
  const [item, setItem] = useState(null);
  const handleCreateItem = () => {};
  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        Are you an admin?
        <Box display="flex" flexDirection="column">
          <AddItem />
        </Box>
        <Button variant="contained" color="secondary">
          Delete
        </Button>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </div>
  );
}
