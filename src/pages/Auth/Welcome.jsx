import { useLocation, useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate로 라우팅 준비
  
  console.log("location.state:", location.state);
  //console.log("localStorage user:", localStorage.getItem('user'));
  
  const nickname =
    location.state?.nickname || JSON.parse(localStorage.getItem('user'))?.nickname;

  // 다음 버튼 클릭 시 InfoSteps로 이동
  const handleNext = () => {
    navigate('/info-steps'); // InfoSteps 페이지로 이동
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <h1>
          <span className="nickname">{nickname}</span>님 안녕하세요!
        </h1>
        <p>
          PICOUNT와 함께 건강한 소비 습관을 시작하기 전,<br />
          <span className="highlight">더욱 간편한 예산 설정</span>을 위한 몇 가지 사항을
          입력해주세요!
        </p>
        <p className="subtext">
          입력해 주신 사항들을 메인 페이지에서 바로 반영해 드려요! <br />
          {/* <span className="highlight">맞춤 예산 설정안 추천</span>을 해드려요! */}
        </p>
        <button className="welcome-button" onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
}
