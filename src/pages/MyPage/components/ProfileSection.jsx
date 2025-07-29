import React from "react";
import styles from "./ProfileSection.module.css";
import FriendsSection from "./FriendsSection";
import { useProfile } from "../../../context/useProfile";

export default function ProfileSection() {
  const { nickname, intro, profileImage, friendCode, error } = useProfile();

  return (
    <div className={styles.profileSection}>
      <div className={styles.profileImage}>
        <img
          src={profileImage || "/assets/profile_default.png"}
          alt="프로필"
          className={styles.imagePreview}
        />
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
          <div className={styles.code}>
            {friendCode !== "" ? friendCode : error || "없음"}
          </div>
        </div>

        <div className={styles.columnRow}>
          <FriendsSection />
        </div>
      </div>
    </div>
  );
}
