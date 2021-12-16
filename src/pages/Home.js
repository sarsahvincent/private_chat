import React, { useEffect, useState } from "react";
import { db, auth } from "../firebse";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import User from "../components/User";

function Home() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");

  useEffect(() => {
    const usersRef = collection(db, "users");

    // create query object
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));

    //execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });

    return () => unsub();
  }, []);

  const selectUser = (user) => {
    setChat(user);
  };
  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User key={user.uid} user={user} selectUser={selectUser} />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <div className="messages_user">{chat.name}</div>
        ) : (
          <h3 className="no_conv">Select a use to start a conversation</h3>
        )}
      </div>
    </div>
  );
}

export default Home;
