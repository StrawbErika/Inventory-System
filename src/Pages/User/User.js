import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core/";
import { db } from "../../db";
import "firebase/auth";
import Item from "./Components/Item/Item";
import Request from "./Components/Request/Request";
import Owned from "./Components/Owned/Owned";

export default function User({ user, onLogout }) {
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

  const signOut = () => {
    onLogout();
  };

  useEffect(() => {
    initializeItems();
    initializeRequests();
    initializeOwned();
  }, []);

  return (
    <Box my={10}>
      <Box mx={3} display="flex" justifyContent="flex-end">
        <Button variant="outlined" color="secondary" onClick={signOut}>
          {" "}
          Sign Out
        </Button>
      </Box>
      <Box mt={3} mb={5} fontSize={20} display="flex" flexDirection="column">
        <Box>
          <Box>Welcome {user.displayName},</Box>
          <Box>what would you like to request today?</Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="flex-start">
        <Box
          display="flex"
          flexDirection="column"
          width="30%"
          alignItems="center"
        >
          <Box fontSize={20} mb={2}>
            Items
          </Box>
          {items &&
            items.map((item) => {
              return <Item item={item} user={user} />;
            })}
        </Box>{" "}
        <Box display="flex" flexDirection="column" width="30%">
          <Box fontSize={20}>Requests</Box>
          <div>
            {requests && requests.length > 0 ? (
              requests.map((request) => {
                return (
                  <Request
                    item={request}
                    requestItems={requests}
                    onRequest={handleRequests}
                    user={user}
                  />
                );
              })
            ) : (
              <Box color="gray" fontSize={20} my={2}>
                {" "}
                No outgoing requests
              </Box>
            )}
          </div>
        </Box>
        <Box display="flex" flexDirection="column" width="30%">
          <Box fontSize={20}>Approved/Owned Items</Box>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            {owned && owned.length > 0 ? (
              owned.map((own) => {
                return <Owned item={own} user={user} />;
              })
            ) : (
              <Box color="gray" fontSize={20} my={2}>
                No items owned
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
