import React, { useEffect, useState } from "react";
import styles from "./ProfileSection.module.css";
import FriendsSection from "./FriendsSection";
import FriendAddButton from "./FriendAddButton";
import { useProfile } from "../../../context/useProfile";
import axios from "axios";
import api from "../../../api/axiosInstance";

export default function ProfileSection() {
  const { nickname, intro, profileImage } = useProfile();
  const [friendCode, setFriendCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriendCode = async () => {
      try {
        const response = await api.get("/api/members/friend-code", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, // ✅ headers 밖에 있어야 함!
        });

        console.log("응답 확인:", response.data); // <-- 꼭 콘솔로 구조 확인!

        const code = response.data?.data?.friendCode;
        if (code) {
          setFriendCode(code);
        } else {
          setError("불러오기 실패"); // 여기 타면 data는 있었는데 friendCode가 undefined임
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
          <div className={styles.code}>
            {error ? error : friendCode || "로딩 중..."}
          </div>
        </div>

        <div className={styles.columnRow}>
          <FriendsSection />
        </div>
      </div>
    </div>
  );
}
