import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import './InfoSteps.css';

export default function InfoSteps() {
  const [step, setStep] = useState(1); // 단계
  const [formData, setFormData] = useState({
    purpose: '',
    job: '',
    budget: '',
    spendCategories: [],
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ 추가
  const user = JSON.parse(localStorage.getItem('user'));
  const nickname = user?.nickname || '회원';

  const handleNext = () => {
    if (step === 4) {
      // 마지막 단계면 로딩 → 저장
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem('userInfo', JSON.stringify(formData));
        navigate('/home'); // ✅ 저장 후 홈화면으로 이동
      }, 2000); // 2초 로딩 효과
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const toggleCategory = (category) => {
    setFormData((prev) => {
      const exists = prev.spendCategories.includes(category);
      const newCategories = exists
        ? prev.spendCategories.filter((c) => c !== category)
        : prev.spendCategories.length < 4 // ✅ 최대 선택 개수 4개로 유지
          ? [...prev.spendCategories, category]
          : prev.spendCategories; 
      return { ...prev, spendCategories: newCategories };
    });
  };

  return (
    <div className="info-steps-page">
      <div className="info-steps-container">
        {!loading ? (
          <>
            <div className="step-indicator">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={step === n ? 'active' : ''}>●</span>
              ))}
            </div>

            {step === 1 && (
              <>
                <h2>나를 소개해 주세요!</h2>
                <p>가입목적</p>
                <div className="button-group">
                  {['소비 습관 개선', '자금 관리', '소비 내역 기록', '기타'].map((item) => (
                    <button
                      key={item}
                      className={formData.purpose === item ? 'selected' : ''}
                      onClick={() =>
                        setFormData({ ...formData, purpose: item })
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2>나를 소개해 주세요!</h2>
                <p>직군</p>
                <div className="button-group">
                  {['직장인', '학생', '전업 주부', '프리랜서', '기타'].map((item) => (
                    <button
                      key={item}
                      className={formData.job === item ? 'selected' : ''}
                      onClick={() =>
                        setFormData({ ...formData, job: item })
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2>이번 달 예상 예산은 얼마인가요?</h2>
                <div className="button-group">
                  {[
                    '100,000 ~ 150,000',
                    '200,000 ~ 250,000',
                    '300,000 ~ 350,000',
                    '직접 입력',
                  ].map((item) => (
                    <button
                      key={item}
                      className={formData.budget === item ? 'selected' : ''}
                      onClick={() =>
                        setFormData({ ...formData, budget: item })
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2>주로 어떤 항목에 지출하시나요?</h2>
                <p className="small-text">최대 4개 선택 가능</p>
                <div className="button-group grid-2x3">
                  {['식비', '교통비', '취미', '쇼핑', '저축', '기타'].map((item) => (
                    <button
                      key={item}
                      className={formData.spendCategories.includes(item) ? 'selected' : ''}
                      onClick={() => toggleCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className={`nav-buttons ${step === 1 ? 'single' : ''}`}>
              {step > 1 && (
                <button onClick={handlePrev} className="back-btn">이전</button>
              )}
              <button
                onClick={handleNext}
              >
                {step === 4 ? '완료' : '다음'}
              </button>
            </div>

          </>
        ) : (
          <div className="loading-screen">
            <h2>{nickname}님을 위한 맞춤 예산안을 찾고 있어요!</h2>
          </div>
        )}
      </div>
    </div>
  );
}
