import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../../../db";
import firebase from "firebase/app";
import "firebase/auth";
import { Add } from "@material-ui/icons/";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";

export default function AddItem({ onAddItem }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [item, setItem] = useState(null);
  const handleFieldChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddItem = async () => {
    try {
      const itemRef = await db.collection("items").add({
        id: null,
        name: item.name,
        quantity: item.quantity,
      });
      await db.collection("items").doc(itemRef.id).update({
        id: itemRef.id,
      });
      const newItem = {
        id: itemRef.id,
        name: item.name,
        quantity: item.quantity,
      };
      onAddItem(newItem);
      handleClick();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Box display="flex" flexDirection="column">
        <Box my={2} fontSize={20}>
          Add an Item into the List
        </Box>
        <Box display="flex" flexDirection="row" mb={2}>
          <Box mr={1}>
            <TextField
              label="Item Name"
              name="name"
              onChange={handleFieldChange}
              variant="outlined"
            />
          </Box>
          <Box width="100px" mr={1}>
            <TextField
              label="Quantity"
              name="quantity"
              onChange={handleFieldChange}
              type="number"
              variant="outlined"
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            <Add />
          </Button>
        </Box>
      </Box>
      <SimpleSnackbar
        message={"Item has been added"}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
}
