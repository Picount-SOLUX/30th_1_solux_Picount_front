import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: 이메일 인증, 2: 새 비밀번호 설정
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 이메일 인증 버튼 클릭
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

    // 이메일 전송 성공했다고 가정
    alert('인증 이메일이 전송되었습니다.');
    setErrorMessage('');
    setStep(2); // 다음 단계로 이동
  };

  // 비밀번호 변경 버튼 클릭
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

    alert('비밀번호가 성공적으로 변경되었습니다.');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">비밀번호 재설정</h2>
      <div className="login-box">
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

        {step === 2 && (
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
    </div>
  );
}
