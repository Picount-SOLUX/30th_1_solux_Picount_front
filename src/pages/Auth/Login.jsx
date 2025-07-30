import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/AuthAPI";
import FindPassword from '../Auth/FindPassword'
import "./Login.css";

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
/////////////////////////로그인 API///////////////////////////
  const handleLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await login({ email, password });
      console.log("로그인 응답:", response.data);

      if (response.data.success) {
        let { accessToken, refreshToken, nickname } = response.data.data;
        // 🟢 nickname undefined 방지
        nickname = nickname ?? "테스트유저";
        // 로컬 스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("user", JSON.stringify({ nickname }));
        console.log("localStorage 저장됨:", localStorage.getItem("user"));
        setUserInfo({ nickname });
        setShowModal(true);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "서버 오류가 발생했습니다."
      );
    }
  };
//////////////////////////로그인 API//////////////////////////

/// 엔터 치면 로그인
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const nickname = storedUser.nickname || "테스트유저";

    const hasLoggedIn = localStorage.getItem("hasLoggedIn") === "true";

    if (!hasLoggedIn) {
      localStorage.setItem("hasLoggedIn", "true");
      navigate("/welcome", { state: { nickname } });
    } else {
      navigate("/home");
    }
  };


  // 카카오 로그인 핸들러 수정
const handleKakaoLogin = () => {
  // 백엔드가 꺼져있을 때는 콜백 URL로 바로 이동 (가짜 토큰 포함)
  if (import.meta.env.VITE_USE_BACKEND === "false") {
    console.log("⚠️ 백엔드 OFF 상태 → mock 콜백 흐름으로 이동");
    window.location.href =
      "/callback?access_token=mock-access-token&refresh_token=mock-refresh-token&is_new=false";
  } else {
    // 백엔드 연동 ON일 때 실제 카카오 로그인 URL로 이동
    window.location.href = "https://7ace74aa4830.ngrok-free.app/api/login/oauth2/authorization/kakao";
  }
};

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      <div className="login-box">
        <input
          type="email"
          placeholder="이메일"
          className="login-input"
          ref={emailRef}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="login-input"
          ref={passwordRef}
          onKeyDown={handleKeyDown}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="login-links">
          <a onClick={() => navigate("/find-password")} className="link-text">
            비밀번호 찾기
          </a>
        </div>

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-divider">
          <span className="divider-text">SNS 로그인</span>
        </div>

        {/* 카카오톡 로그인 버튼 (이미지) */}
        <div className="sns-icons">
          <div className="kakao-container">
            <a
              href="https://7ace74aa4830.ngrok-free.app/api/login/oauth2/authorization/kakao" // ✅ 백엔드 URL 연결
              //onClick={(e) => {
                //e.preventDefault();
                //handleKakaoLogin();
              //}}
              style={{ cursor: "pointer" }}
            >
              <img
                src="src/assets/icons/kakaotalk.png"
                alt="kakao login"
                className="kakao-bg"
              />
              <img
                src="src/assets/icons/kakao_icon.png"
                alt="kakao login"
                className="kakao-fg"
              />
            </a>
          </div>
        </div>

      </div>


      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>로그인 성공!</h3>
            <button onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
