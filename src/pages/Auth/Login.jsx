import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태 추가
  const [userInfo, setUserInfo] = useState(null);    // ✅ 유저 정보 저장

  const handleLogin = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // localStorage에서 회원 정보 불러오기
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      // ✅ 유저 정보 저장 후 모달 열기
      setUserInfo(storedUser);
      setShowModal(true);
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // ✅ 모달 닫기 및 페이지 이동
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
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-divider">
          <span className="divider-text">SNS 로그인</span>
        </div>

        <div className="sns-icons">
          <img src="icons/naver_icon.png" alt="naver login" className="naver" />
          <img src="icons/kakao_icon.png" alt="kakao login" className="kakao" />
        </div>

        <div className="login-links">
          <a href="#">아이디 찾기 </a>
          <span className="divider-bar">|</span>
          <a href="#"> 비밀번호 찾기</a>
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
