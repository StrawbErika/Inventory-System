import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../db";
import "firebase/auth";
import AddItem from "./Components/AddItem/AddItem";
import Item from "./Components/Item/Item";
import Requests from "./Components/Requests/Requests";

export default function Admin({ user, onLogout }) {
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

  const handleChangeItem = (items) => {
    setItems(items);
  };
  const signOut = () => {
    onLogout();
  };

  useEffect(() => {
    initializeItems();
    initializeUsers();
  }, []);
  return (
    <Box my={10}>
      <Box mx={3} display="flex" justifyContent="flex-end">
        <Button variant="outlined" color="secondary" onClick={signOut}>
          {" "}
          Sign Out
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box mt={3} mb={5} fontSize={20} display="flex" flexDirection="column">
          <Box>
            <Box>Welcome Admin {user.displayName},</Box>
            <Box>what would you like to do today?</Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <AddItem onAddItem={handleAddItem} />
        </Box>
        <Box display="flex" flexDirection="row" mt={5}>
          <Box mx={10}>
            <Box mb={2} fontSize={20}>
              Items
            </Box>
            {items &&
              items.map((item) => {
                return (
                  <Item
                    item={item}
                    items={items}
                    onDeleteItem={handleChangeItem}
                  />
                );
              })}
          </Box>
          <Box mx={10}>
            <Box mb={2} fontSize={20}>
              Users
            </Box>
            {users &&
              users.map((user) => {
                // return <Request user={user} />;
                return (
                  <Box
                    mt={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box>{user.displayName} requests:</Box>
                    <Requests
                      user={user}
                      items={items}
                      onChangeOriginalItem={handleChangeItem}
                    />
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
