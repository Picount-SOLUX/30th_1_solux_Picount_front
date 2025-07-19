import React from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import styles from "./Guestbooks.module.css";

export default function Guestbook() {
  return (
    <div className={styles.container}>
      <MessageList />
      <MessageInput />
    </div>
  );
}
