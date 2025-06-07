import React from "react";
import "../styles/Message.css";

const Message = (props) => {
  const isBot = props.speaks === "bot";

  const avatar = isBot
    ? "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
    : "https://cdn-icons-png.flaticon.com/512/1144/1144760.png";

  return (
    <div className={`message-wrapper ${isBot ? "bot" : "user"}`}>
      {isBot && <img src={avatar} alt="bot" className="avatar" />}
      <div className="message-text">{props.text}</div>
      {!isBot && <img src={avatar} alt="user" className="avatar" />}
    </div>
  );
};

export default Message;




