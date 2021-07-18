import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import { db } from "../../db";
import firebase from "firebase/app";
import "firebase/auth";
import Item from "./Components/Item/Item";
import Request from "./Components/Request/Request";
import Owned from "./Components/Owned/Owned";
export default function User({ user }) {
  const [items, setItems] = useState(null);
  const [requests, setRequests] = useState(null);
  const [owned, setOwned] = useState(null);

  const handleRequests = (requests) => {
    setRequests(requests);
  };
  const initializeItems = () => {
    async function run() {
      const res = await db.collection("items").get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setItems(documents);
    }
    run();
  };
  const initializeRequests = () => {
    async function run() {
      const res = await db
        .collection("users")
        .doc(user.id)
        .collection("requesting")
        .get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setRequests(documents);
    }
    run();
  };
  const initializeOwned = () => {
    async function run() {
      const res = await db
        .collection("users")
        .doc(user.id)
        .collection("owned")
        .get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setOwned(documents);
    }
    run();
  };

  useEffect(() => {
    initializeItems();
    initializeRequests();
    initializeOwned();
  }, []);

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
        {requests &&
          requests.map((request) => {
            return (
              <Request
                item={request}
                requestItems={requests}
                onRequest={handleRequests}
                user={user}
              />
            );
          })}
        {owned &&
          owned.map((own) => {
            return <Owned item={own} />;
          })}
      </Box>
    </div>
  );
}
