import React, { useState } from "react";
import { Box, Button } from "@material-ui/core/";
import { db } from "../../../../db";
import "firebase/auth";
import { Close, Check } from "@material-ui/icons/";
import SimpleSnackbar from "../../../../Components/SimpleSnackbar/SimpleSnackbar";

export default function ItemRequest({
  item,
  items,
  itemRequests,
  user,
  onRequestItem,
  onChangeOriginalItem,
}) {
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const [canAllow, setCanAllow] = useState(true);

  const handleAllow = () => {
    const originalItem = items.filter((list) => list.id == item.id)[0];
    if (item.quantity < originalItem.quantity) {
      // TODO: for safety parse into int
      db.collection("users")
        .doc(user.id)
        .collection("requesting")
        .doc(item.id)
        .delete()
        .then(() => {
          onRequestItem(
            itemRequests.filter((request) => request.id != item.id)
          );
        })
        .catch((error) => {
          alert("Error removing document: ", error);
        });

      try {
        db.collection("users")
          .doc(user.id)
          .collection("owned")
          .doc(item.id)
          .set({
            name: item.name,
            quantity: item.quantity,
            id: item.id,
          });
        const editedQty = originalItem.quantity - item.quantity;
        db.collection("items").doc(item.id).update({
          quantity: editedQty,
        });
        db.collection("items")
          .doc(item.id)
          .collection("borrowers")
          .doc(user.id)
          .set({
            id: user.id,
            quantity: editedQty,
          });
        const itemList = items.filter((original) => original.id != item.id);
        const editedItem = {
          id: item.id,
          quantity: editedQty,
          name: item.name,
        };
        onChangeOriginalItem([...itemList, editedItem]);
      } catch (error) {
        console.error(error);
      }
      handleClick();
      setSnackbarMessage("Request approved");
    } else {
      handleClick();
      setSnackbarMessage("Request asks more than what is available");
      setCanAllow(false);
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
    const removedItem = itemRequests.filter((request) => request.id != item.id);
    const newItem = {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    };
    onRequestItem([...removedItem, newItem]);
    handleClick();
    setSnackbarMessage("Request has been declined");
  };
  //TODO: instant load on decline

  return (
    <Box display="flex" flexDirection="row" alignItems={"center"} my={1}>
      <Box>{item.name}</Box>
      <Box mx={1}>{item.quantity}</Box>

      {item.status === "declined" ? (
        <div> {item.status} </div>
      ) : (
        <>
          {canAllow && (
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAllow}
              >
                <Check />
              </Button>
            </Box>
          )}
          <Box mx={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDecline}
            >
              <Close />
            </Button>
          </Box>
        </>
      )}
      <SimpleSnackbar
        message={snackbarMessage}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
