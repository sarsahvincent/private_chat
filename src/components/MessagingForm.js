import React from "react";
import Attachment from "./svg/Attachment";
import PapaClip from "./svg/PapaClip";

function MessagingForm({ handelSubmit, text, setText, img, setImg }) {
  return (
    <form className="message_form" onSubmit={handelSubmit}>
      <label htmlFor="img">
        {img && <PapaClip />}
        <Attachment />
      </label>
      <input
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => setImg(e.target.files[0])}
      />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter message"
        />
      </div>
      <div>
        <button
          disabled={(!text || text === "") && !img}
          type="submit"
          className="btn"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessagingForm;
