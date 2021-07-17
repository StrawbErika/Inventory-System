import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function Item({ item, items, onDeleteItem }) {
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

  return (
    <div>
      <div>
        {item.quantity}
        {item.name}
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          deleteItem(item.id);
        }}
      >
        Delete
      </Button>
    </div>
  );
}
