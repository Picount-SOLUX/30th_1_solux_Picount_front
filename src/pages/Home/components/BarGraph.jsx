import React from "react";
import "./BarGraph.css";

export default function BarGraph({ categories }) {
  // categories가 없으면 기본 더미 데이터로 방어
  const isDummy = !Array.isArray(categories);
  const finalCategories = isDummy
    ? [
        { id: 1, name: "식비", amount: 50000, spent: 30000 },
        { id: 2, name: "쇼핑", amount: 40000, spent: 15000 },
        { id: 3, name: "교통", amount: 30000, spent: 20000 },
        { id: 4, name: "고정비", amount: 50000, spent: 35000 },
        { id: 5, name: "여가", amount: 50000, spent: 35000 },
      ]
    : categories;
  console.log(categories);
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
                    {isDummy ? "****원" : `${spentAmount.toLocaleString()}원`}
                  </span>
                  <span className="budget-amount">
                    {isDummy ? "****원" : `${budgetAmount.toLocaleString()}원`}
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
