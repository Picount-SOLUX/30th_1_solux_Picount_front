import React from "react";
import "./BarGraph.css";

export default function BarGraph({ categories }) {
  const handleEditClick = () => {
    // 색테마 변경 기능 추가 예정
    console.log("그래프 색테마 변경");
  };

  return (
    <div className="bar-graph-container">
      <div className="bar-graph-content">
        {categories.map((cat) => {
          const budgetAmount = parseInt(cat.amount || 0);
          const spentAmount = parseInt(cat.spent || 0);
          const remainingAmount = budgetAmount - spentAmount;
          const spentPercent = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
          const remainingPercent = budgetAmount > 0 ? (remainingAmount / budgetAmount) * 100 : 0;

          return (
            <div key={cat.id} className="bar-item">
              <div className="bar-label">{cat.name}</div>
              <div className="bar-wrapper">
                <div className="progress-bar">
                  <div
                    className="progress-spent"
                    style={{ width: `${spentPercent}%` }}
                  ></div>
                  <div
                    className="progress-remaining"
                    style={{ width: `${remainingPercent}%` }}
                  ></div>
                </div>
                <div className="bar-info">
                  <span className="spent-amount">{spentAmount.toLocaleString()}원</span>
                  <span className="budget-amount">{budgetAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}