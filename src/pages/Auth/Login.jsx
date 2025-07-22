import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from "../../api/AuthAPI"; 
import './Login.css';

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [userInfo, setUserInfo] = useState(null);    // 유저 정보
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지

  const handleLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }
///////////////////////로그인 API/////////////////////////
    try {
      // 로그인 API 호출
      const response = await login({ email, password });
      console.log("로그인 응답:", response.data);

      if (response.data.success) {
        const { accessToken, refreshToken, nickname } = response.data.data;

        // 토큰 로컬 스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUserInfo({ nickname }); 

        setShowModal(true);
        setErrorMessage(""); // 에러 초기화
      } else {
        setErrorMessage(response.data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "서버 오류가 발생했습니다.");
    }
  }
/////////////////////로그인 API////////////////////////////
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const goToResetPassword = () => {
    navigate('/reset-password'); // 🔥 비밀번호 변경 페이지로 이동
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/welcome', {
      state: {
        nickname: userInfo.nickname,
        gender: userInfo.gender,
        age: userInfo.age,
      },
    });
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
        {/* 🔥 에러 메시지 영역 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="login-links">
          <a onClick={goToResetPassword} className="link-text">비밀번호 찾기</a>
        </div>

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-divider">
          <span className="divider-text">SNS 로그인</span>
        </div>

        <div className="sns-icons">
          <div className="kakao-container">
            <a
              href={`https://kauth.kakao.com/oauth/authorize?client_id=7c1549534b329385c5627a58fc23a7e9&redirect_uri=http://localhost:5173/oauth/kakao&response_type=code`}
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

      {/* 로그인 성공 모달 */}
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
