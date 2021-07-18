import React, { useEffect, useState } from "react";
import { TextField, Box, Radio, Button } from "@material-ui/core/";
import firebase from "firebase/app";
import { db } from "../../../../db";
import "firebase/auth";
import ItemRequest from "../ItemRequest/ItemRequest";
import Item from "../../../User/Components/Item/Item";

export default function Requests({ user }) {
  const [itemRequests, setItemRequests] = useState(null);
  const getUserRequests = () => {
    async function run() {
      const res = await db
        .collection("users")
        .doc(user.id)
        .collection("requesting")
        .get();
      const docs = res.docs;
      const documents = docs.map((doc) => doc.data());
      setItemRequests(documents);
    }
    run();
  };

  const handleItemRequests = (items) => {
    setItemRequests(items);
  };

  useEffect(() => {
    getUserRequests();
  }, []);
  return (
    <Box display="flex" flexDirection="row" alignItems={"center"}>
      {itemRequests && itemRequests.length > 0 ? (
        itemRequests.map((item) => {
          return (
            <ItemRequest
              item={item}
              user={user}
              items={itemRequests}
              onRequestItem={handleItemRequests}
            />
          );
        })
      ) : (
        <div> None </div>
      )}
    </Box>
  );
}
