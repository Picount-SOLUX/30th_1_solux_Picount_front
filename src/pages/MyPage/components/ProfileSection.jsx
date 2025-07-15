import React from "react";
import styles from "./ProfileSection.module.css";

export default function ProfileSection() {
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileImage}></div>
      <div className={styles.info}>
        <div className={styles.nickname}>닉네임</div>
        <div className={styles.intro}>한 줄 소개</div>
        <div className={styles.friendCode}>
          친구 코드: <strong>-----!</strong>
        </div>
      </div>
    </div>
  );
}
