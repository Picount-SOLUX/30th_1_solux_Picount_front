import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CakeGraph from "../Home/components/CakeGraph";
import BarGraph from "../Home/components/BarGraph";
import Calendar from "../Home/components/Calendar";
import Guestbook from "./GuestBooks";
import styles from "./FriendHome.module.css";
import api from "../../api/axiosInstance"; // ✅ axiosInstance 불러오기

export default function FriendHome() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friendData, setFriendData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFriendMainData = async () => {
      try {
        const res = await api.get(`/api/friends/main?ownerId=${friendId}`);

        if (res.data.success) {
          setFriendData(res.data.data);
        } else {
          setErrorMessage(res.data.message || "조회에 실패했습니다.");
        }
      } catch (err) {
        setErrorMessage("친구 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchFriendMainData();
  }, [friendId]);

  if (errorMessage) return <div>{errorMessage}</div>;
  if (!friendData) return <div>로딩 중...</div>;
}
