
import React from "react";
import "./CakeGraph.css";

// 이미지 10장 import
import cake1 from "../../../assets/cakes/BasicCake/1.png";
import cake2 from "../../../assets/cakes/BasicCake/2.png";
import cake3 from "../../../assets/cakes/BasicCake/3.png";
import cake4 from "../../../assets/cakes/BasicCake/4.png";
import cake5 from "../../../assets/cakes/BasicCake/5.png";
import cake6 from "../../../assets/cakes/BasicCake/6.png";
import cake7 from "../../../assets/cakes/BasicCake/7.png";
import cake8 from "../../../assets/cakes/BasicCake/8.png";
import cake9 from "../../../assets/cakes/BasicCake/9.png";
import cake10 from "../../../assets/cakes/BasicCake/10.png";

// 이미지 배열
const cakeImages = [cake1, cake2, cake3, cake4, cake5, cake6, cake7, cake8, cake9, cake10];

export default function CakeGraph({ totalBudget, totalSpent }) {
  const remainingPercent =
    totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;

  // 비율에 따라 케이크 이미지 선택 (1~10 단계)
  let cakeStage = Math.ceil((remainingPercent / 100) * 10);
  if (cakeStage < 1) cakeStage = 1;
  if (cakeStage > 10) cakeStage = 10;

  // 디버깅용 (개발 완료 후 제거)
  console.log({
    totalBudget,
    totalSpent,
    remainingPercent,
    cakeStage
  });

  return (
    <div className="cake-graph-container">
      <div className="cake-image-wrapper">
        <img
          src={cakeImages[cakeStage - 1]}
          alt={`케이크 그래프 ${cakeStage}단계`}
          className="cake-image"
        />
      </div>
      <div className="budget-info-box">
        <div className="budget-text">
          <div>전체 예산: {totalBudget.toLocaleString()}원</div>
          <div>지출: {totalSpent.toLocaleString()}원</div>
        </div>
        <button className="edit-btn">변경</button>
      </div>
    </div>
  );
}