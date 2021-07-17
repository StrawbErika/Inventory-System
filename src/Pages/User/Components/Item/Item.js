import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function Item({ item, user }) {
  const [tempItem, setTemptItem] = useState(item);
  const [response, setResponse] = useState(null);
  const handleFieldChange = (e) => {
    setTemptItem({
      ...tempItem,
      [e.target.name]: e.target.value,
    });
  };

  const requestItem = async () => {
    if (tempItem.quantity > item.quantity) {
      setResponse("We don't have that much dumbass");
    } else {
      setResponse("Ok pls wait while we ask the admins");
      try {
        db.collection("users")
          .doc(user.id)
          .collection("requesting")
          .doc(tempItem.id)
          .set({
            name: tempItem.name,
            quantity: tempItem.quantity,
            id: tempItem.id,
          });
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      <Box marginRight={2}>
        <>
          {item.quantity}
          {item.name}
          <TextField
            label="Item Quantity"
            name="quantity"
            onChange={handleFieldChange}
            value={tempItem.quantity}
            type="number"
            variant="outlined"
          />
        </>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          requestItem();
        }}
      >
        Request
      </Button>
      {response && <div>{response}</div>}
    </Box>
  );
}
