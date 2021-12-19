import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../assets/images/avatar.png";
import Camera from "../components/svg/Camera";
import Delete from "../components/svg/Delete";
import { storage, db, auth } from "../firebse";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Profile() {
  const [img, setImg] = useState();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uplaodImg = async () => {
        const imgRef = ref(
          storage,
          `chat-app/avatar/${new Date().getTime()} - ${img.name}`
        );

        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uplaodImg();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar");
      if (confirm) {
        deleteObject(ref(storage, user.avatarPath));
      }
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        avatar: "",
        avatarPath: "",
      });
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  return user ? (
    <div className="profile_container">
      <div className="img_container">
        <img src={user?.avatar || Img} alt="profle" />
        <div className="overlay">
          <div>
            <label htmlFor="photo">
              <Camera />
            </label>
            {user.avatarPath ? <Delete deleteImage={deleteImage} /> : null}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="photo"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <div className="text_container">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <hr />
        <small>Joined on : {user.createdAt?.toDate().toDateString()}</small>
      </div>
    </div>
  ) : null;
}

export default Profile;
