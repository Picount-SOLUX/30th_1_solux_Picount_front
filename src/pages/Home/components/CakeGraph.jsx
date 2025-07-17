import React, { useState } from "react";
import "./CakeGraph.css";

// 기본 케이크 이미지 10장 import
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

// 샘플 스킨 이미지 import (2개 예시)
import skin1 from "../../../assets/ShopItems/CakeSkin/WhiteCake.png";
import skin2 from "../../../assets/ShopItems/CakeSkin/CherryCake.png";

// 이미지 배열
const cakeImages = [cake1, cake2, cake3, cake4, cake5, cake6, cake7, cake8, cake9, cake10];

export default function CakeGraph({ totalBudget, totalSpent }) {
  const [selectedSkin, setSelectedSkin] = useState(null); // 선택된 스킨
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [tempSkin, setTempSkin] = useState(null); // 모달 내 임시 선택 스킨

  const remainingPercent =
    totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;

  // 비율에 따라 케이크 이미지 선택 (1~10 단계)
  let cakeStage = Math.ceil((remainingPercent / 100) * 10);
  if (cakeStage < 1) cakeStage = 1;
  if (cakeStage > 10) cakeStage = 10;

  // 현재 케이크 이미지 (스킨 적용 여부에 따라 결정)
  const currentCakeImage = selectedSkin
    ? selectedSkin
    : cakeImages[cakeStage - 1];

  // 더미 데이터: 보유 중인 스킨들
  const ownedSkins = [
    { id: 1, image: skin1, name: "화이트 케이크" },
    { id: 2, image: skin2, name: "체리 케이크" },
  ];

  return (
    <div className="cake-graph-container">
      <div className="cake-image-wrapper">
        <img
          src={currentCakeImage}
          alt="케이크 그래프"
          className="cake-image"
        />
      </div>

      <div className="budget-info-box">
        <div className="budget-text">
          <div>전체 예산: {totalBudget.toLocaleString()}원</div>
          <div>지출: {totalSpent.toLocaleString()}원</div>
        </div>
        <button className="edit-btnn" onClick={() => setShowModal(true)}>
          변경
        </button>
      </div>

      {/* 책자 모달 UI */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="book-modal"
            onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫힘 방지
          >
            {/* 스프링 */}
            <img className="spring1" src="src/assets/cakes/Spring.png"></img>
            <img className="spring2" src="src/assets/cakes/Spring.png"></img>
            <img className="spring3" src="src/assets/cakes/Spring.png"></img>
            <img className="spring4" src="src/assets/cakes/Spring.png"></img>

            <div className="pages">

              {/* 왼쪽 페이지 */}
              <div className="book-page left-page">
                <img
                  src={tempSkin || currentCakeImage}
                  alt="현재 케이크"
                  className="book-cake-image"
                />
              </div>

              {/* 오른쪽 페이지 */}
              <div className="book-page right-page">
                <h3>보유 스킨</h3>
                <div className="skin-list">
                  {ownedSkins.length === 0 ? (
                    <p>보유한 스킨이 없습니다.</p>
                  ) : (
                    ownedSkins.map((skin) => (
                      <div
                        key={skin.id}
                        className={`skin-item ${
                          tempSkin === skin.image ? "selected" : ""
                        }`}
                        onClick={() => setTempSkin(skin.image)}
                      >
                        <img
                          src={skin.image}
                          alt={skin.name}
                          className="skin-image"
                        />
                        <p>{skin.name}</p>
                      </div>
                    ))
                  )}
                </div>
                <button
                  className="apply-btn"
                  onClick={() => {
                    setSelectedSkin(tempSkin);
                    setShowModal(false);
                  }}
                >
                  적용
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
