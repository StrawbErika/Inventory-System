import React, { useState } from "react";
import { Box, Button } from "@material-ui/core/";
import { db } from "../../../../db";
import "firebase/auth";

export default function ItemRequest({
  item,
  items,
  itemRequests,
  user,
  onRequestItem,
  onChangeOriginalItem,
}) {
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
          alert("Document successfully deleted!");
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
    } else {
      console.log(`${originalItem.quantity} is less than ${item.quantity}`);
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
                allow
              </Button>
            </Box>
          )}
          <Box mx={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDecline}
            >
              decline
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
