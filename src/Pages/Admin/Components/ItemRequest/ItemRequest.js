import React from "react";
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
  const handleAllow = () => {
    db.collection("users")
      .doc(user.id)
      .collection("requesting")
      .doc(item.id)
      .delete()
      .then(() => {
        alert("Document successfully deleted!");
        onRequestItem(itemRequests.filter((request) => request.id != item.id));
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
      const originalItem = items.filter((list) => list.id == item.id)[0];
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
  };
  // TODO: modify quantity of item when allow

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
  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      {item.name}
      {item.quantity}
      {item.status === "declined" ? (
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
