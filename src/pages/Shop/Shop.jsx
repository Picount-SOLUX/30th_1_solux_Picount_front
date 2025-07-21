import React from "react";
import "./Shop.css";

const shopItems = [
  // 케이크 꾸미기 스킨
  {
    id: 1,
    category: "케이크 꾸미기 스킨",
    image: "/assets/ShopItems/CakeSkin/WhiteCake.png",
    price: 500,
  },
  {
    id: 2,
    category: "케이크 꾸미기 스킨",
    image: "/assets/ShopItems/CakeSkin/CherryCake.png",
    price: 500,
  },
  {
    id: 3,
    category: "케이크 꾸미기 스킨",
    image: "/assets/ShopItems/CakeSkin/ChocolateCake.png",
    price: 500,
  },
  {
    id: 4,
    category: "케이크 꾸미기 스킨",
    image: "/assets/ShopItems/CakeSkin/CreamCake.png",
    price: 500,
  },

  // 달력 꾸미기 스킨
  {
    id: 5,
    category: "달력 꾸미기 스킨",
    image: "/assets/ShopItems/CalendarSkin/Angel.png",
    price: 500,
  },
  {
    id: 6,
    category: "달력 꾸미기 스킨",
    image: "/assets/ShopItems/CalendarSkin/PopUp.png",
    price: 500,
  },
  {
    id: 7,
    category: "달력 꾸미기 스킨",
    image: "/assets/ShopItems/CalendarSkin/Tomato.png",
    price: 500,
  },
  {
    id: 8,
    category: "달력 꾸미기 스킨",
    image: "/assets/ShopItems/CalendarSkin/Lace.png",
    price: 500,
  },

  // 테마 색상 변경
  {
    id: 9,
    category: "테마 색상 변경",
    image: "/assets/ShopItems/Theme/Blue.png",
    price: 500,
  },
  {
    id: 10,
    category: "테마 색상 변경",
    image: "/assets/ShopItems/Theme/Green.png",
    price: 500,
  },
  {
    id: 11,
    category: "테마 색상 변경",
    image: "/assets/ShopItems/Theme/Yellow.png",
    price: 500,
  },
  {
    id: 12,
    category: "테마 색상 변경",
    image: "/assets/ShopItems/Theme/Gray.png",
    price: 500,
  },
];

function Shop() {
  return (
    <div className="shop-container">
      <div className="point-box">
        <span className="point-label">사용 가능 포인트</span>
        <div className="point-value">
          <span>P</span>
          <strong>1,200 p</strong>
        </div>
      </div>

      {/* 카테고리별 아이템 목록 */}
      {["케이크 꾸미기 스킨", "달력 꾸미기 스킨", "테마 색상 변경"].map(
        (category) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="item-grid">
              {shopItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="shop-item">
                    <img
                      src={item.image}
                      alt="shop item"
                      className="item-image"
                    />
                    <div className="item-footer">
                      <span className="item-price">{item.price} p</span>
                      <button className="buy-btn">구매</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Shop;
