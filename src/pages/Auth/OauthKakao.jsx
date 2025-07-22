import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function OauthKakao() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKakaoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        console.error("인가 코드가 없습니다.");
        navigate("/login");
        return;
      }
//////////////////////카카오 로그인 API////////////////////
      try {
        const res = await api.post("api/social/kakao/login/oauth2/authorization/kakao", { code });
        console.log("카카오 로그인 응답:", res);
        const { accessToken, refreshToken, nickname, isNewUser } = res.data.data;
        // 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        if (isNewUser) {
          // 신규회원이면 InfoSteps로
          navigate("/home", { state: { nickname } });  // 이거 나중에 수정 필요
        } else {
          // 기존회원이면 메인화면으로
          navigate("/home", { state: { nickname } });
        }
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
        navigate("/login");
      }
    };
////////////////////카카오 로그인 API//////////////////////
    fetchKakaoLogin();
  }, [navigate]);

  return <div>카카오 로그인 처리중</div>;
}
