import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FriendManagePage.module.css";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";

export default function FriendManagePage() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .api("https://6e45bd638524.ngrok-free.app/api/friends/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFriends(res.data.data);
        }
      })
      .catch(() => {
        alert("친구 목록을 불러오는 데 실패했습니다.");
      });
  }, []);

  const handleDeleteFriend = async (friendId) => {
    const confirmDelete = window.confirm("정말 친구를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/api/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        alert("친구가 삭제되었습니다.");
        setFriends((prev) => prev.filter((f) => f.memberId !== friendId));
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("삭제 요청에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>친구 관리</h2>
      <ul className={styles.friendList}>
        {friends.length === 0 ? (
          <li className={styles.noFriend}>친구가 없습니다.</li>
        ) : (
          friends.map((friend) => (
            <li key={friend.memberId} className={styles.friendItem}>
              <img
                src={friend.profileImageUrl}
                alt="프로필"
                className={styles.avatar}
              />
              <span className={styles.name}>{friend.nickname}</span>
              <button
                className={styles.delete_Btn}
                onClick={() => handleDeleteFriend(friend.memberId)}
              >
                삭제
              </button>
            </li>
          ))
        )}
      </ul>
      <button className={styles.backBtn} onClick={() => navigate("/settings")}>
        ← 설정으로 돌아가기
      </button>
    </div>
  );
}
