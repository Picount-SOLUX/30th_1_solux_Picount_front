import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmailExists, changePassword } from '../../api/AuthAPI'; // 바꾸셔야 하면 맞게 경로 수정
import './Login.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 새 비밀번호 설정
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // 1단계: 이메일 확인 후 새 비밀번호 단계로
  const handleEmailCheck = async () => {
    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      const res = await checkEmailExists(email); // ✅ 백엔드에 이메일 존재 여부 확인 요청
      if (res.data.data) {
        setErrorMessage('');
        setStep(2); // 다음 단계로
      } else {
        setErrorMessage('가입된 이메일이 아닙니다.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || '이메일 확인 중 오류가 발생했습니다.');
    }
  };

  // 2단계: 비밀번호 변경 요청
  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMessage('');

    try {
      await changePassword({ prePassword: '', newPassword }); // prePassword가 없으면 빈문자열로 처리
      setShowModal(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
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
            <button className="login-button" onClick={handleEmailCheck}>
              다음
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
