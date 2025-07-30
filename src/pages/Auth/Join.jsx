import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/AuthAPI";
import "./Join.css";

export default function Join() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const [error, setError] = useState(""); // 에러 메시지 상태

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    ///////////////////// 회원가입 API ////////////////////////
    try {
      // 회원가입 API 요청
      const response = await signup({
        email,
        password,
        nickname,
      });
      if (!response?.data?.success) {
        console.error("회원가입 실패 또는 응답 없음", response?.data);
        return;
      }

      console.log("회원가입 성공: ", response.data); // 응답 확인

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("✅ 저장됨!", localStorage.getItem("accessToken"));
        // nickname까지 함께 저장
        localStorage.setItem("user", JSON.stringify({ nickname }));
        setShowModal(true);

        //localStorage.setItem("hasLoggedIn", "true");

        // 모달 열기
      } else {
        setError(response.data.message || "회원가입에 실패");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
    }
  };
  //////////////////////회원가입 API////////////////////////

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
    navigate("/login"); // 로그인 페이지로 이동
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
              placeholder="비밀번호(영문, 숫자 조합 8~15자리)"
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

          {/* 에러 메시지 */}
          {error && <p className="error-message">{error}</p>}

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
