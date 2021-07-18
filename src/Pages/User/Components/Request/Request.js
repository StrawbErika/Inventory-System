import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function Request({ item, requestItems, onRequest, user }) {
  const handleOk = () => {
    db.collection("users")
      .doc(user.id)
      .collection("requesting")
      .doc(item.id)
      .delete()
      .then(() => {
        alert("Document successfully deleted!");
        onRequest(requestItems.filter((request) => request.id != item.id));
      })
      .catch((error) => {
        alert("Error removing document: ", error);
      });
  };

  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      {item.name}
      {item.quantity}
      {item.status === "declined" ? (
        <>
          Has been declined
          <Button onClick={handleOk}> OK </Button>
        </>
      ) : (
        <>{item.status}</>
      )}
    </Box>
  );
}
