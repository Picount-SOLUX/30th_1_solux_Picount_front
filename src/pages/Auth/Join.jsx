import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Join.css';

export default function Join() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(''); // 선택사항
  const [age, setAge] = useState('');       // 선택사항

  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태 추가

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원 정보 저장
    const userData = {
      email,
      password,
      nickname,
      gender: gender || '선택안함', // 선택 안 하면 기본값
      age: age || '선택안함',       // 선택 안 하면 기본값
    };

    localStorage.setItem('user', JSON.stringify(userData));

    // ✅ 모달 열기
    setShowModal(true);
  };

  // ✅ 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <div className="join-page">
      <h2 className="join-title">회원가입</h2>
      <div className="join-container">
        <form className="join-form" onSubmit={handleSubmit}>
          {/* 이메일 */}
          <label>
            <div className="label-row">
              이메일 <span className="required">*</span>
            </div>
            <input
              type="email"
              placeholder="이메일 입력"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* 비밀번호 */}
          <label>
            <div className="label-row">
              비밀번호 <span className="required">*</span>
            </div>
            <input
              type="password"
              placeholder="비밀번호(영문, 숫자 조합 8자리 이상 15자리 이하)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* 비밀번호 확인 */}
          <label>
            <div className="label-row">
              비밀번호 확인 <span className="required">*</span>
            </div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {/* 닉네임 */}
          <label>
            <div className="label-row">
              닉네임 <span className="required">*</span>
            </div>
            <input
              type="text"
              placeholder="닉네임 입력"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>

          {/* 성별 (선택사항) */}
          <div className="gender-age-section">
            <div className="gender">
              <label>성별(선택)</label>
              <div className="gender-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="남"
                    onChange={(e) => setGender(e.target.value)}
                  />{' '}
                  남
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="여"
                    onChange={(e) => setGender(e.target.value)}
                  />{' '}
                  여
                </label>
              </div>
            </div>

            {/* 나이 (선택사항) */}
            <div className="age">
              <label>나이(선택)</label>
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">선택안함</option>
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대 이상">40대 이상</option>
              </select>
            </div>
          </div>

          <button type="submit" className="join-button">
            회원가입
          </button>
        </form>
      </div>

      {/* 회원가입 완료 모달 */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>가입 완료</h3>
            <p>회원가입이 완료되었습니다!</p>
            <button onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
