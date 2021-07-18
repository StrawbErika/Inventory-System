import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../db";
import "firebase/auth";
import AddItem from "./Components/AddItem/AddItem";
import Item from "./Components/Item/Item";
import Requests from "./Components/Requests/Requests";

export default function Admin() {
  const [items, setItems] = useState(null);
  const [users, setUsers] = useState(null);

  const initializeItems = () => {
    async function run() {
      const res = await db.collection("items").get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setItems(documents);
    }
    run();
  };

  const initializeUsers = () => {
    async function run() {
      const res = await db.collection("users").get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setUsers(documents.filter((doc) => doc.type === "user"));
    }
    run();
  };

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleDeleteItem = (items) => {
    setItems(items);
  };

  useEffect(() => {
    initializeItems();
    initializeUsers();
  }, []);
  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        Are you an admin?
        <Box display="flex" flexDirection="column">
          <AddItem onAddItem={handleAddItem} />
        </Box>
        {items &&
          items.map((item) => {
            return (
              <Item item={item} items={items} onDeleteItem={handleDeleteItem} />
            );
          })}
        {users &&
          users.map((user) => {
            // return <Request user={user} />;
            return (
              <Box display="flex" flexDirection="column">
                <>{user.displayName} requests: </>
                <Requests user={user} />
              </Box>
            );
          })}
      </Box>
    </div>
  );
}
