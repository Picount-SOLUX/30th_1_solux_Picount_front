import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/AuthAPI";
import "./Login.css";

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const goToResetPassword = () => {
    navigate("/reset-password");
  };

  const closeModal = () => {
    setShowModal(false);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const nickname = storedUser.nickname || "테스트유저";
    navigate("/welcome", { state: { nickname } });
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
          <a onClick={goToResetPassword} className="link-text">
            비밀번호 찾기
          </a>
        </div>

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3>로그인 성공!</h3>
              <button onClick={closeModal}>확인</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
