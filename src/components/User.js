import React from "react";
import Image from "../assets/images/avatar.png";

function User({ user, selectUser }) {
  return (
    <div className="user_wrapper" onClick={() =>selectUser(user)}>
      <div className="user_info">
        <div className="user_detail">
          <img src={user.avatar || Image} alt="avatar" className="avatar" />
          <h4>{user.name}</h4>
        </div>
        <div>
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
      </div>
    </div>
  );
}

export default User;
