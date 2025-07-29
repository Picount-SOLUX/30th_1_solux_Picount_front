import React from "react";
import "./BarGraph.css";

export default function BarGraph({ categories }) {
  // ✅ 확실한 방어: categories가 undefined일 경우 기본 더미 데이터 사용
  const finalCategories = Array.isArray(categories)
    ? categories
    : [
        { id: 1, name: "식비", amount: 50000, spent: 30000 },
        { id: 2, name: "쇼핑", amount: 40000, spent: 15000 },
        { id: 3, name: "교통", amount: 30000, spent: 20000 },
      ];

  return (
    <div className="bar-graph-container">
      <div className="bar-graph-content">
        {finalCategories.map((cat) => {
          const budgetAmount = parseInt(cat.amount || 0);
          const spentAmount = parseInt(cat.spent || 0);
          const remainingAmount = budgetAmount - spentAmount;
          const spentPercent =
            budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
          const remainingPercent =
            budgetAmount > 0 ? (remainingAmount / budgetAmount) * 100 : 0;

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
                  <span className="spent-amount">
                    {spentAmount.toLocaleString()}원
                  </span>
                  <span className="budget-amount">
                    {budgetAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
