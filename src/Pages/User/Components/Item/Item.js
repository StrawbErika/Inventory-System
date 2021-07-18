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

  // TODO: update request items whenever allow
  const requestItem = async () => {
    if (tempItem.quantity > item.quantity) {
      console.log(tempItem);
      console.log(item);
      setResponse(`${tempItem.quantity} is bigger than ${item.quantity}`);
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
            status: "pending",
          });
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      <Box
        my={1}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box mx={2} width="100px">
          {item.name}
        </Box>
        <Box width="100px" marginRight={2}>
          <TextField
            label="QTY"
            name="quantity"
            onChange={handleFieldChange}
            value={tempItem.quantity}
            type="number"
            variant="outlined"
            // size="small"
          />
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
      </Box>

      {response && <div>{response}</div>}
    </Box>
  );
}
