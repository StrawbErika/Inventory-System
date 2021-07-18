import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function ItemRequest({ item, items, user, onRequestItem }) {
  const handleAllow = () => {
    db.collection("users")
      .doc(user.id)
      .collection("requesting")
      .doc(item.id)
      .delete()
      .then(() => {
        alert("Document successfully deleted!");
        onRequestItem(items.filter((request) => request.id != item.id));
      })
      .catch((error) => {
        alert("Error removing document: ", error);
      });

    try {
      db.collection("users").doc(user.id).collection("owned").doc(item.id).set({
        name: item.name,
        quantity: item.quantity,
        id: item.id,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleDecline = () => {
    db.collection("users")
      .doc(user.id)
      .collection("requesting")
      .doc(item.id)
      .update({
        status: "declined",
      });
    const removedItem = items.filter((request) => request.id != item.id);
    const newItem = {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    };
    onRequestItem([...removedItem, newItem]);
  };
  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      {item.name}
      {item.quantity}
      {item.status ? (
        <div> {item.status} </div>
      ) : (
        <>
          <Button variant="contained" color="secondary" onClick={handleAllow}>
            allow
          </Button>

          <Button variant="contained" color="secondary" onClick={handleDecline}>
            decline
          </Button>
        </>
      )}
    </Box>
  );
}
