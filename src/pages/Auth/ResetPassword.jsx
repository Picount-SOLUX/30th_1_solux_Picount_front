import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 단계: 1-이메일, 2-코드, 3-새 비밀번호
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태 추가

  // 이메일 인증 요청
  const handleEmailVerification = () => {
    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.email !== email) {
      setErrorMessage('가입된 이메일이 아닙니다.');
      return;
    }

    // 임시 인증 코드 생성
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`임시 인증 코드: ${code}`);
    setVerificationCode(code);
    setErrorMessage('');
    setStep(2);
  };

  // 인증 코드 확인
  const handleCodeVerification = () => {
    setErrorMessage('');
    setStep(3);
  };

  // 비밀번호 재설정
  const handlePasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    storedUser.password = newPassword;
    localStorage.setItem('user', JSON.stringify(storedUser));

    // ✅ 모달 열기
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">비밀번호 재설정</h2>
      <div className="login-box">
        {/* 1단계: 이메일 입력 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="가입된 이메일"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="login-button" onClick={handleEmailVerification}>
              인증 이메일 전송
            </button>
          </>
        )}

        {/* 2단계: 인증 코드 입력 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="인증 코드 입력"
              className="login-input"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="login-button" onClick={handleCodeVerification}>
              인증 코드 확인
            </button>
          </>
        )}

        {/* 3단계: 새 비밀번호 설정 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="새 비밀번호"
              className="login-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              className="login-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="login-button" onClick={handlePasswordReset}>
              비밀번호 변경
            </button>
          </>
        )}
      </div>

      {/* ✅ 비밀번호 변경 성공 모달 */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>비밀번호가 성공적으로 변경되었습니다.</h3>
            <button onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
