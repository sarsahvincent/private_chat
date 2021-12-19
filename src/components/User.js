import { onSnapshot, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Image from "../assets/images/avatar.png";
import { db } from "../firebse";

function User({ user, selectUser, user1, chat }) {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unSub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });

    return () => unSub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user.avatar || Image} alt="avatar" className="avatar" />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`user_status ${user.isOnline ? "online" : "offline"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me" : null}</strong> {data.text}{" "}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Image}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
    </>
  );
}

export default User;
