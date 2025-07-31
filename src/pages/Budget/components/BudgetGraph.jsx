import React from "react";
import graphHelpImage from "../../../assets/도움말그래프.png"; // 경로 확인!
import "../Budget.css";

export default function BudgetGraph({
  categories,
  isEditing,
  tempCategories,
  totalBudget,
  jobInfo,
  showHelp,
  toggleHelp,
}) {
  const displayCategories = isEditing ? tempCategories : categories;

  return (
    <section className="budget-graph-section">
      <div className="graph-header">
        <h2 className="section-title">예산 설정 내역</h2>
        <span
          className="help-icon"
          onClick={toggleHelp}
          title="추천 예산 보기"
        >
          ❓
        </span>
      </div>

      {showHelp && jobInfo && (
        <div className="help-bubble">
          <h4>{jobInfo.title} 추천 예산안</h4>
          <p>{jobInfo.description}</p>
          {jobInfo.title === "대학생" && (
            <img
              src={graphHelpImage}
              alt="대학생 추천 예산 그래프"
              className="help-graph-image"
            />
          )}
          <button onClick={toggleHelp} className="close-btn">
            닫기
          </button>
        </div>
      )}

      <div className="budget-graph">
        <div className="graph-bar">
          {displayCategories.map((cat, idx) => {
            const percent =
              totalBudget > 0
                ? (parseInt(cat.amount || 0) / totalBudget) * 100
                : 0;
            return (
              <div
                key={idx}
                className="graph-segment"
                style={{
                  width: `${percent}%`,
                  backgroundColor: `hsl(${idx * 50}, 70%, 70%)`,
                }}
                title={`${cat.name}: ${cat.amount}원 (${percent.toFixed(
                  1
                )}%)`}
              ></div>
            );
          })}
        </div>
        <div className="graph-total">
          총예산: {totalBudget.toLocaleString()}원
        </div>
      </div>
    </section>
  );
}
