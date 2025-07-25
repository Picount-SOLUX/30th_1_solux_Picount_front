// src/pages/Auth/FindPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmailExists, findPassword } from "../../api/AuthAPI";
import "./Login.css";

export default function FindPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 비밀번호 재설정
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [memberId, setMemberId] = useState(null); // ✅ 추가

  //////////////////////비밀번호 찾기 API////////////////////////
  // 1단계: 이메일 확인
  const handleEmailCheck = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }
    try {
      const res = await checkEmailExists(email);
      console.log("이메일로 회원 찾기 응답:", res.data);

      if (res.data.success) {
        setMemberId(res.data.data); // ✅ memberId 저장
        setErrorMessage("");
        setStep(2); // 다음 단계로
      } else {
        setErrorMessage("가입된 이메일이 아닙니다.");
      }
    } catch (err) {
      console.error("이메일 확인 오류:", err);
      setErrorMessage(
        err.response?.data?.message || "이메일 확인 중 오류가 발생했습니다."
      );
    }
  };

  // 2단계: 비밀번호 변경
  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const res = await findPassword({ memberId, newPassword }); // ✅ memberId와 함께 전달
      console.log("비밀번호 변경 응답:", res.data);
      setShowModal(true);
    } catch (err) {
      console.error("비밀번호 변경 오류:", err);
      setErrorMessage(
        err.response?.data?.message || "비밀번호 변경에 실패했습니다."
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/login");
  };
  ////////////////////////비밀번호 찾기 API//////////////////////

  return (
    <div className='login-container'>
      <h2 className='login-title'>비밀번호 찾기</h2>
      <div className='login-box'>
        {step === 1 && (
          <>
            <input
              type='email'
              placeholder='가입된 이메일'
              className='login-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            <button className='login-button' onClick={handleEmailCheck}>
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type='password'
              placeholder='새 비밀번호'
              className='login-input'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type='password'
              placeholder='새 비밀번호 확인'
              className='login-input'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            <button className='login-button' onClick={handlePasswordReset}>
              비밀번호 변경
            </button>
          </>
        )}
      </div>

      {showModal && (
        <div className='modal-backdrop'>
          <div className='modal-content'>
            <h3>비밀번호가 성공적으로 변경되었습니다.</h3>
            <button onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
