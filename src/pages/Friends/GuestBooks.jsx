import React from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import styles from "./Guestbooks.module.css";

export default function Guestbook({ showInput = true }) {
  return (
    <div className={styles.container}>
      <MessageList />
      {showInput && <MessageInput />}
    </div>
  );
}
