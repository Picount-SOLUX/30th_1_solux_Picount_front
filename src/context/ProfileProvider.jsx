import React, { useState, useEffect } from "react";
import { ProfileContext } from "./ProfileContext";
import api from "../api/axiosInstance";

export const ProfileProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [friendCode, setFriendCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");
    const token = localStorage.getItem("accessToken");

    if (!memberId || !token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
    console.log("accessToken", localStorage.getItem("accessToken"));
    console.log("memberId", localStorage.getItem("memberId"));

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/members/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;

        setNickname(data.nickname || "");
        setIntro(data.intro || "");
        setProfileImage(data.profileImageUrl || "");

        localStorage.setItem("nickname", data.nickname || "");
        localStorage.setItem("intro", data.intro || "");
        localStorage.setItem("profileImageUrl", data.profileImageUrl || "");
      } catch (err) {
        console.error("❌ 프로필 API 오류:", err);
        console.log(
          "⛔ localStorage nickname",
          localStorage.getItem("nickname")
        );
        console.log("⛔ localStorage intro", localStorage.getItem("intro"));
        setError("프로필 정보를 불러오는 데 실패했습니다.");

        setNickname(localStorage.getItem("nickname") || "");
        setIntro(localStorage.getItem("intro") || "");
        setProfileImage(localStorage.getItem("profileImageUrl") || "");
      }
    };
    const fetchFriendCode = async () => {
      try {
        const res = await api.get(`/members/friend-code`);
        setFriendCode(res.data.data || "");
      } catch (err) {
        console.error("❌ 친구 코드 API 오류:", err);
      }
    };

    // 병렬로 동시에 실행
    Promise.allSettled([fetchProfile(), fetchFriendCode()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        nickname,
        setNickname,
        intro,
        setIntro,
        profileImage,
        setProfileImage,
        friendCode,
        setFriendCode,
        loading,
        error,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
