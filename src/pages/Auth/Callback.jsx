// src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const isNewUser = params.get("is_new");
    const error = params.get("error");

    if (error) {
      console.error("카카오 로그인 실패:", error);
      navigate("/login");
      return;
    }

    if (accessToken && refreshToken) {
      // 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (isNewUser === "true") {
        // 신규회원이면 회원가입 추가정보 입력 페이지로 이동
        navigate("/info-steps");
      } else {
        // 기존회원이면 홈으로 이동
        navigate("/home");
      }
    } else {
      console.error("토큰이 없습니다.");
      navigate("/login");
    }
  }, [navigate]);

  return <div>카카오 로그인 처리중</div>;
}
