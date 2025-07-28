import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBudget } from "../../api/BudgetAPI.js"; // API 함수 불러오기
import { updateMemberGroup, createCategories, updateBudgetPlan } from "../../api/BudgetAPI";

import "./InfoSteps.css";

const convertJobToEnum = (job) => {
  switch (job) {
    case "중·고등학생": return "STUDENT_YOUTH";
    case "대학생": return "STUDENT_UNIV";
    case "전업주부": return "FULL_TIME_HOMEMAKER";
    case "2030대 직장인": return "WORKER_2030";
    case "4050대 직장인": return "WORKER_4050";
    case "프리랜서": return "FREELANCER";
    case "기타": return "OTHERS";
    default: return "OTHERS";
  }
};

export default function InfoSteps() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    job: "",
    budget: "",
  });
  const [customBudget, setCustomBudget] = useState(""); // 직접 입력 금액 상태
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const nickname = user?.nickname || "회원";

  const handleNext = async () => {
    if (step === 2 && formData.budget === "직접 입력") {
      if (!customBudget || parseInt(customBudget) <= 0) {
        alert("유효한 금액을 입력해주세요.");
        return;
      }
      setFormData({ ...formData, budget: customBudget });
    }

    if (step === 3) {
      setLoading(true);
///////////////////직군 변경＆예산 생성 API//////////////////////////
      try {
        // 1. 직군 변경 먼저
        const groupTypePayload = {
          memberGroupType: convertJobToEnum(formData.job), // 아래 함수 참고
        };
        const groupResponse = await updateMemberGroup(groupTypePayload);
        console.log("직군 변경 성공:", groupResponse.data);

        // 2. 예산 생성 요청
        const startDate = new Date().toISOString().split("T")[0];
        const endDate = new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        )
          .toISOString()
          .split("T")[0];

        const totalAmount = parseInt(formData.budget.toString().replace(/,/g, ""));
        const budgetPayload = { startDate, endDate, totalAmount };
        const budgetResponse = await createBudget(budgetPayload);
        const budgetId = budgetResponse.data.data.budgetId;
        console.log("예산 생성 성공:", budgetResponse.data);
        //localStorage.setItem("budgetId", budgetResponse.data.id);
        // 위에 이거 로컬에 저장할 필요가 있나? -> 없는 듯

        // 3. 직군에 따른 추천 카테고리 생성
        const jobBudgets = {
          "중·고등학생": [
            { label: "식비", percent: 30 },
            { label: "교통비", percent: 15 },
            { label: "교재비", percent: 30 },
            { label: "쇼핑/문화", percent: 10 },
            { label: "기타", percent: 15 },
          ],
          "대학생": [
            { label: "식비", percent: 25 },
            { label: "교통비", percent: 10 },
            { label: "고정비(월세)", percent: 20 },
            { label: "모임/약속", percent: 15 },
            { label: "쇼핑/문화", percent: 10 },
            { label: "저축", percent: 10 },
            { label: "기타", percent: 10 },
          ],
          "전업주부": [
            { label: "식비", percent: 35 },
            { label: "생활용품", percent: 25 },
            { label: "자녀교육", percent: 15 },
            { label: "교통비", percent: 10 },
            { label: "저축", percent: 10 },
            { label: "기타", percent: 5 },
          ],
          "2030대 직장인": [
            { label: "식비", percent: 25 },
            { label: "고정비", percent: 30 },
            { label: "교통비", percent: 10 },
            { label: "취미/자기계발", percent: 10 },
            { label: "저축/투자", percent: 20 },
            { label: "기타", percent: 5 },
          ],
          "4050대 직장인": [
            { label: "식비", percent: 20 },
            { label: "고정지출", percent: 35 },
            { label: "자녀교육", percent: 20 },
            { label: "저축/투자", percent: 20 },
            { label: "기타", percent: 5 },
          ],
          "프리랜서": [
            { label: "식비", percent: 20 },
            { label: "업무비(장비 등)", percent: 20 },
            { label: "고정지출", percent: 15 },
            { label: "저축/투자", percent: 20 },
            { label: "자기계발", percent: 15 },
            { label: "기타", percent: 10 },
          ],
          "기타": [
            { label: "식비", percent: 20 },
            { label: "고정지출", percent: 20 },
            { label: "저축", percent: 20 },
            { label: "기타", percent: 40 },
          ],
        };

        const categoriesData =
          (jobBudgets[formData.job] || []).map((cat) => ({
            categoryName: cat.label,
            type: "EXPENSE",
          }));

        // 카테고리 API 요청 (여러 개)
        const categoriesRes = await createCategories(categoriesData);
        console.log("카테고리 생성 완료!!", categoriesRes.data);

        // 4. budgetAllocationList 구성
        const createdCategories = categoriesRes.data; // [{id, categoryName}, ...]
        const budgetPlans = createdCategories.map((cat, idx) => {
          const percent = jobBudgets[formData.job][idx].percent;
          const amount = Math.round((totalAmount * percent) / 100);
          return { categoryId: cat.id, amount };
        });

        // 5. 예산 & 세부 예산 계획 수정
        const res = await updateBudgetPlan(budgetId, {
          startDate,
          endDate,
          totalAmount,
          budgetAllocationList: budgetPlans,
        });
        console.log("예산 & 세부예산계획 수정 완료!!", res.data);
          // 완료 처리
        localStorage.setItem("budgetId", budgetId);
        localStorage.setItem("selectedJob", formData.job);
        localStorage.setItem("selectedBudget", totalAmount.toString());

        navigate("/budget");
      } catch (err) {
        console.error("직군 변경 또는 예산 생성 실패:", err);
        alert("예산 생성 또는 직군 설정에 실패했습니다. 다시 시도해주세요.");
        setLoading(false);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.job;
    if (step === 2)
      return !formData.budget || (formData.budget === "직접 입력" && !customBudget);
    return false;
  };

  return (
    <div className="info-steps-page">
      <div className="info-steps-container">
        {!loading ? (
          <>
            <div className="step-indicator">
              {[1, 2, 3].map((n) => (
                <span key={n} className={step === n ? "active" : ""}>
                  ●
                </span>
              ))}
            </div>

            {step === 1 && (
              <>
                <h2>나를 소개해 주세요!</h2>
                <p>직군</p>
                <div className="button-group">
                  {[
                    "중·고등학생",
                    "대학생",
                    "전업주부",
                    "2030대 직장인",
                    "4050대 직장인",
                    "프리랜서",
                    "기타",
                  ].map((item) => (
                    <button
                      key={item}
                      className={formData.job === item ? "selected" : ""}
                      onClick={() => setFormData({ ...formData, job: item })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2>이번 달 예상 예산은 얼마인가요?</h2>
                <div className="button-group">
                  {["300000", "500000", "1000000", "2000000", "3000000", "직접 입력"].map(
                    (item) => (
                      <button
                        key={item}
                        className={formData.budget === item ? "selected" : ""}
                        onClick={() => {
                          setFormData({ ...formData, budget: item });
                          if (item !== "직접 입력") setCustomBudget("");
                        }}
                      >
                        {item === "직접 입력" ? "직접 입력" : `${parseInt(item).toLocaleString()}원`}
                      </button>
                    )
                  )}
                </div>

                {/* 직접 입력일 때 금액 입력창 표시 */}
                {formData.budget === "직접 입력" && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="number"
                      placeholder="금액을 입력하세요 (숫자만)"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      style={{
                        width: "90%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginTop: "8px",
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <h2>예산 설정을 완료하시겠어요?</h2>
                <p>
                  선택한 직군: <strong>{formData.job}</strong>
                </p>
                <p>
                  선택한 한 달 예산:{" "}
                  <strong>
                    {parseInt(formData.budget).toLocaleString()}원
                  </strong>
                </p>
              </>
            )}

            <div className={`nav-buttons ${step === 1 ? "single" : ""}`}>
              {step > 1 && (
                <button onClick={handlePrev} className="back-btn">
                  이전
                </button>
              )}
              <button onClick={handleNext} disabled={isNextDisabled()}>
                {step === 3 ? "완료" : "다음"}
              </button>
            </div>
          </>
        ) : (
          <div className="loading-screen">
            <h2>추천 예산안 만드는 중</h2>
          </div>
        )}
      </div>
    </div>
  );
}
