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
    <Box display="flex" flexDirection="row" alignItems={"center"} my={1}>
      <Box marginRight={2}>
        {editing ? (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box>
              <TextField
                label="Item Name"
                name="name"
                value={tempItem.name}
                onChange={handleFieldChange}
                variant="outlined"
              />
            </Box>
            <Box mx={1} width="100px">
              <TextField
                label="Item Quantity"
                name="quantity"
                value={tempItem.quantity}
                onChange={handleFieldChange}
                type="number"
                variant="outlined"
              />
            </Box>
            <Box>
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
          </Box>
        ) : (
          <Box display="flex" flexDirection="row">
            <Box mx={1} width="20px">
              {item.quantity}
            </Box>
            <Box width="100px">{item.name}</Box>
          </Box>
        )}
      </Box>
      <Box mx={1}>
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
      </Box>

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
