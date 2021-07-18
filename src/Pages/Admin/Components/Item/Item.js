import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";
import { Edit, Delete, Done } from "@material-ui/icons/";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";

export default function Item({ item, items, onDeleteItem }) {
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

  const [editing, setEditing] = useState(false);
  const [tempItem, setTemptItem] = useState(item);

  const deleteItem = (ID) => {
    deleteBorrowersItems(ID);
    db.collection("items")
      .doc(ID)
      .delete()
      .then(() => {
        onDeleteItem(items.filter((item) => item.id != ID));
        handleClick();
      })
      .catch((error) => {
        alert("Error removing document: ", error);
      });
  };

  const deleteBorrowersItems = (ID) => {
    async function run() {
      const res = await db
        .collection("items")
        .doc(ID)
        .collection("borrowers")
        .get();
      const docs = res.docs;
      const ids = docs.map((doc) => doc.data().id);
      ids.map((id) => {
        db.collection("users")
          .doc(id)
          .collection("owned")
          .doc(ID)
          .delete()
          .then(() => {
            console.log("items deleted");
          })
          .catch((error) => {
            alert("Error removing document: ", error);
          });
      });
    }
    run();
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
            <Box width="100px">
              <TextField
                label="Quantity"
                name="quantity"
                value={tempItem.quantity}
                onChange={handleFieldChange}
                type="number"
                variant="outlined"
              />
            </Box>
            <Box mx={1}>
              <TextField
                label="Item Name"
                name="name"
                value={tempItem.name}
                onChange={handleFieldChange}
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
                <Done />
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
          <Edit />
        </Button>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          deleteItem(item.id);
        }}
      >
        <Delete />
      </Button>
      <SimpleSnackbar
        message={"Item has been deleted"}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
