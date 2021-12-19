import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebse";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessagingForm from "../components/MessagingForm";
import Message from "../components/Message";

function Home() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [user1]));
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

  const selectUser = async (user) => {
    setChat(user);
    //id of selected user
    const user2 = user.uid;
    //id for unique identifier
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    //creating a messages ref

    const megsRef = collection(db, "messages", id, "chat");
    //then create a query object.. we want to show the latest massage at the bottom

    const q = query(megsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    //getDoc runs just once
    //we are to get the last message between the logged in user and the selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    //if last message exits and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      //updage last message doc and set unread to false
      await updateDoc(doc(db, "lastMsg", id), {
        unread: false,
      });
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;
    // messages => id => chat => addDoc
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let url;
    //if image exit, then reacte the image reference
    if (img) {
      const imgRef = ref(
        storage,
        `chat-app/images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
    setText("");
    setImg("");
  };

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">{chat.name}</div>

            <div className="messages">
              {msgs.length
                ? msgs.map((msg, index) => (
                    <Message key={index} user1={user1} msg={msg} />
                  ))
                : null}
            </div>
            <MessagingForm
              handelSubmit={handelSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
              img={img}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a use to start a conversation</h3>
        )}
      </div>
    </div>
  );
}

export default Home;
