import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function Owned({ item }) {
  return (
    <Box display="flex" flexDirection="column" alignItems={"center"}>
      {item.name}
      {item.quantity}
      {item.status}
    </Box>
  );
}
