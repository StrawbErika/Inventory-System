import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import Item from "./Components/Item/Item";

export default function User({ user }) {
  const [items, setItems] = useState(null);

  const initializeItems = () => {
    async function run() {
      const res = await db.collection("items").get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setItems(documents);
    }
    run();
  };

  // const handleAddItem = (item) => {
  //   setItems([...items, item]);
  // };

  // const handleDeleteItem = (items) => {
  //   setItems(items);
  // };

  useEffect(initializeItems, []);
  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        Are you a User?
        {items &&
          items.map((item) => {
            return <Item item={item} user={user} />;
          })}
      </Box>
    </div>
  );
}
