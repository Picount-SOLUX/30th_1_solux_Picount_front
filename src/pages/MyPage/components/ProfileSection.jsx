import React, { useEffect, useState } from "react";
import styles from "./ProfileSection.module.css";
import FriendsSection from "./FriendsSection";
import { useProfile } from "../../../context/useProfile";
import api from "../../../api/axiosInstance";

export default function ProfileSection() {
  const { intro, profileImage } = useProfile();
  const [friendCode, setFriendCode] = useState("");
  const [error, setError] = useState("");
  const nickname =
    location.state?.nickname ||
    JSON.parse(localStorage.getItem("user"))?.nickname;

  useEffect(() => {
    const fetchFriendCode = async () => {
      try {
        const response = await api.get("/members/friend-code", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        console.log("응답 확인:", response.data);

        const code = response.data?.data; // data는 바로 코드 문자열
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

    fetchFriendCode(); // ✅ 함수 호출이 useEffect 바깥에 있어야 함
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
