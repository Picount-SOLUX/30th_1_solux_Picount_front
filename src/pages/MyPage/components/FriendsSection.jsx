import React from "react";
import styles from "./FriendsSection.module.css";

const mockFriends = Array(5).fill(null); // 가짜 친구 5명

export default function FriendsSection() {
  return (
    <div className={styles.friendsSection}>
      <div className={styles.label}>친구</div>
      <div className={styles.friendsList}>
        {mockFriends.map((_, idx) => (
          <div key={idx} className={styles.friendItem}>
            <div className={styles.friendAvatar}></div>
            <div className={styles.friendName}>닉네임</div>
          </div>
        ))}
        <div className={styles.addFriend}>
          <div className={styles.plusIcon}>＋</div>
        </div>
      </div>
    </div>
  );
}
