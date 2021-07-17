import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../../../db";
import firebase from "firebase/app";
import "firebase/auth";

export default function AddItem() {
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Box display="flex" flexDirection="row">
        <TextField
          label="Item Name"
          name="name"
          onChange={handleFieldChange}
          variant="outlined"
        />
        <TextField
          label="Item Quantity"
          name="quantity"
          onChange={handleFieldChange}
          type="number"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add
        </Button>
      </Box>
    </div>
  );
}
