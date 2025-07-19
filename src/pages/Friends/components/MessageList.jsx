import React from "react";
import MessageItem from "./MessageItem";
import styles from "./MessageList.module.css";

const dummyMessages = [
  {
    id: 1,
    nickname: "닉네임",
    time: "2025-07-01 15:45",
    content: "안녕하세요! 반가워요 :)",
    profileImg: null,
  },
  {
    id: 2,
    nickname: "닉네임",
    time: "2025-07-01 15:45",
    content: "오늘도 좋은 하루 되세요!",
    profileImg: null,
  },
  {
    id: 3,
    nickname: "닉네임",
    time: "2025-07-01 15:45",
    content: "방문 감사합니다!",
    profileImg: null,
  },
  {
    id: 4,
    nickname: "닉네임",
    time: "2025-07-01 15:45",
    content: "ㅇㅇ",
    profileImg: null,
  },
];

export default function MessageList() {
  return (
    <div className={styles.messageList}>
      {dummyMessages.map((msg) => (
        <MessageItem key={msg.id} {...msg} />
      ))}
    </div>
  );
}
