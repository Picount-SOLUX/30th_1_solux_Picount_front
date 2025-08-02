import React, { useEffect, useState } from "react";
import styles from "./ProfileSection.module.css";
import FriendsSection from "./FriendsSection";
import { useProfile } from "../../../context/useProfile";
import api from "../../../api/axiosInstance";

export default function ProfileSection() {
  const { intro: introContext, profileImage: profileImageContext } = useProfile();
  const [friendCode, setFriendCode] = useState("");
  const [error, setError] = useState("");

  // ✅ 로컬스토리지에서 nickname, intro, profileImage 가져오기
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setNickname(user.nickname || "없음");
      setIntro(user.intro || introContext || "없음");
      setProfileImage(user.profileImage || profileImageContext || "/assets/profile_default.png");
    }
  }, [introContext, profileImageContext]);

  useEffect(() => {
    const fetchFriendCode = async () => {
      try {
        const response = await api.get("/members/friend-code", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        const code = response.data?.data;
        if (code) {
          setFriendCode(code);
        } else {
          setError("불러오기 실패");
        }
      } catch (err) {
        console.error("API 오류:", err);
        setError("API 오류 발생");
      }
    };

    fetchFriendCode();
  }, []);

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
