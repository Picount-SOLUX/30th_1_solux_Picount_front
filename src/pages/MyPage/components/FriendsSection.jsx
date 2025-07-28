import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FriendsSection.module.css";
import FriendAddButton from "./FriendAddButton";
import api from "../../../api/axiosInstance";

export default function FriendsSection() {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.get("/friends/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setFriends(res.data.data);
        } else {
          setError(res.data.message || "불러오기에 실패했습니다.");
        }
      } catch (err) {
        setError("친구 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className={styles.friendsSection}>
      <div className={styles.label}>친구</div>
      <div className={styles.friendsList}>
        {friends.map((friend) => (
          <div key={friend.memberId} className={styles.friendItem}>
            <img
              src={friend.profileImageUrl}
              alt="프로필"
              className={styles.friendAvatar}
            />
            <div className={styles.friendName}>{friend.nickname}</div>
          </div>
        ))}
        <div className={styles.friendItem}>
          <FriendAddButton />
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
