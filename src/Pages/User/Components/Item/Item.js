import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";
import { db } from "../../../../db";
import "firebase/auth";

export default function Item({ item, user }) {
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

  const [tempItem, setTemptItem] = useState(item);
  const [response, setResponse] = useState(null);
  const handleFieldChange = (e) => {
    setTemptItem({
      ...tempItem,
      [e.target.name]: e.target.value,
    });
    setResponse(null);
  };

  // TODO: update request items whenever allow
  const requestItem = async () => {
    if (tempItem.quantity > item.quantity) {
      setResponse(`You are requesting more than what is available`);
    } else {
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
      handleClick();
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      my={1}
    >
      <Box display="flex" flexDirection="row" alignItems={"center"}>
        <Box
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
      </Box>
      <Box my={1} color="red" fontSize="15px">
        {response && response}
      </Box>
      <SimpleSnackbar
        message={"Kindly wait for the admin to approve your request"}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
