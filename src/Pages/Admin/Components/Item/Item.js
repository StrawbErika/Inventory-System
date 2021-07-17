import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function Item({ item, items, onDeleteItem }) {
  const [editing, setEditing] = useState(false);
  const [tempItem, setTemptItem] = useState(item);
  const deleteItem = (ID) => {
    db.collection("items")
      .doc(ID)
      .delete()
      .then(() => {
        alert("Document successfully deleted!");
        onDeleteItem(items.filter((item) => item.id != ID));
      })
      .catch((error) => {
        alert("Error removing document: ", error);
      });
  };
  const handleFieldChange = (e) => {
    setTemptItem({
      ...tempItem,
      [e.target.name]: e.target.value,
    });
  };

  const editItem = (ID) => {
    db.collection("items").doc(ID).update({
      name: tempItem.name,
      quantity: tempItem.quantity,
    });
    const removedItem = items.filter((item) => item.id != ID);
    // TODO:rename too
    const newItem = {
      id: ID,
      name: tempItem.name,
      quantity: tempItem.quantity,
    };
    onDeleteItem([...removedItem, newItem]);
    // TODO:rename onDelete to a more general
  };

  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      <Box marginRight={2}>
        {editing ? (
          <Box display="flex" flexDirection="row" alignItems="center">
            <TextField
              label="Item Name"
              name="name"
              value={tempItem.name}
              onChange={handleFieldChange}
              variant="outlined"
            />
            <TextField
              label="Item Quantity"
              name="quantity"
              value={tempItem.quantity}
              onChange={handleFieldChange}
              type="number"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                editItem(tempItem.id);
                setEditing(false);
              }}
            >
              Done
            </Button>
          </Box>
        ) : (
          <>
            {item.quantity}
            {item.name}
          </>
        )}
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setEditing(!editing);
          setTemptItem(item);
        }}
      >
        Edit
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          deleteItem(item.id);
        }}
      >
        Delete
      </Button>
    </Box>
  );
}
