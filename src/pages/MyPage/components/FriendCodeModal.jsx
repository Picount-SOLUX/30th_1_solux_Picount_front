import React, { useState } from "react";
import axios from "axios";
import styles from "./FriendCodeModal.module.css";
import api from "../../../api/axiosInstance";

export default function FriendCodeModal({ onClose }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await api.post(
        "/friends/request",
        { friendCode: code },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("친구 요청이 성공적으로 전송되었습니다!");
        onClose();
      } else {
        setError(response.data.message || "요청 실패");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) setError("유효하지 않은 사용자입니다.");
        else if (status === 409)
          setError("이미 친구 상태이거나 대기 중입니다.");
        else setError(data.message || "알 수 없는 오류가 발생했습니다.");
      } else {
        setError("서버에 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>친구 코드 입력</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="코드를 입력하세요"
            className={styles.input}
          />
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttons}>
            <button type="submit">확인</button>
          </div>
        </form>
      </div>
    </div>
  );
}
