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
      Your request for
      <Box mx={1} color="blue">
        {item.name}
      </Box>
      of quantity
      <Box marginLeft={1} color="blue">
        {item.quantity}
      </Box>
      {item.status === "declined" ? (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box mx={1}>has been declined</Box>
          <Button variant="outlined" color="primary" onClick={handleOk}>
            {" "}
            OK{" "}
          </Button>
        </Box>
      ) : (
        <>{item.status}</>
      )}
    </Box>
  );
}
