import React, { useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import styles from "./Guestbooks.module.css";

export default function Guestbook({ showInput = true, friendId }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className={styles.container}>
      {showInput && (
        <MessageInput friendId={friendId} onMessageSubmit={addMessage} />
      )}
      <MessageList messages={messages} />
    </div>
  );
}
