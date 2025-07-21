import React from "react";
import styles from "./ProfileSection.module.css";
import FriendsSection from "./FriendsSection";
import FriendAddButton from "./FriendAddButton";

export default function ProfileSection() {
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileImage}></div>

      <div className={styles.infoSection}>
        <div className={styles.row}>
          <div className={styles.label}>닉네임</div>
        </div>

        <div className={styles.columnRow}>
          <div className={styles.label}>한 줄 소개</div>
          <div className={styles.introBox}></div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>친구 코드</div>
          <div className={styles.code}>ABKF35K</div>
        </div>

        <div className={styles.columnRow}>
          <FriendsSection />
          <FriendAddButton />
        </div>
      </div>
    </div>
  );
}
