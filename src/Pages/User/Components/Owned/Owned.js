import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";
import Admin from "../../../Admin/Admin";

export default function Owned({ item, user }) {
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
  const getOriginalObject = async () => {
    const res = await db.collection("items").get();
    const docs = res.docs;
    const document = docs.map((doc) => doc.data());
    return document.filter((doc) => doc.id === item.id)[0];
  };

  const returnItem = async () => {
    const originalObject = await getOriginalObject();
    const editedQty =
      parseInt(originalObject.quantity) + parseInt(item.quantity);
    try {
      db.collection("users")
        .doc(user.id)
        .collection("owned")
        .doc(item.id)
        .delete();
      db.collection("items").doc(item.id).update({
        quantity: editedQty,
      });
      db.collection("items")
        .doc(item.id)
        .collection("borrowers")
        .doc(user.id)
        .delete();
    } catch (error) {
      console.error(error);
    }
    handleClick();
  };
  return (
    <Box
      display="flex"
      alignItems={"center"}
      justifyContent="space-between"
      my={1}
      width="70%"
    >
      <Box mx={1}>{item.name}</Box>
      <Box>{item.quantity}</Box>
      <Button variant="contained" color="secondary" onClick={returnItem}>
        Return
      </Button>
      <SimpleSnackbar
        message={"Item has been returned"}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
