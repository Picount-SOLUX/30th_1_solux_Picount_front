import React from "react";
import styles from "./ProfileSection.module.css";
import FriendsSection from "./FriendsSection";
import FriendAddButton from "./FriendAddButton";
import { useProfile } from "../../../context/useProfile";

export default function ProfileSection() {
  const { nickname, intro, profileImage } = useProfile();
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileImage}>
        {profileImage ? (
          <img
            src={profileImage}
            alt="프로필"
            className={styles.imagePreview}
          />
        ) : (
          <div className={styles.placeholder}>프로필 없음</div>
        )}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.row}>
          <div className={styles.label}>닉네임</div>
          <div>{nickname || "없음"}</div>
        </div>

        <div className={styles.columnRow}>
          <div className={styles.label}>한 줄 소개</div>
          <div className={styles.introBox}>{intro || "없음"}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>친구 코드</div>
          <div className={styles.code}>ABKF35K</div>
        </div>

        <div className={styles.columnRow}>
          <FriendsSection />
        </div>
      </div>
    </div>
  );
}
