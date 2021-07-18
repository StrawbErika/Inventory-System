import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";

export default function Owned({ item }) {
  return (
    <Box
      display="flex"
      alignItems={"center"}
      justifyContent="space-between"
      my={1}
      width="70%"
    >
      <Box mx={1}>{item.name}</Box>
      <Box>{item.quantity}</Box>
    </Box>
  );
}
