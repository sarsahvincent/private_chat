import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebse";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/auth";

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  /*   const { userId } = useSelector((state) => state.users);
  console.log("current", userId); */
  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser?.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };
  return (
    <nav>
      <h3>
        <Link to="/">Messaging</Link>
      </h3>
      <div>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={handleSignout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
