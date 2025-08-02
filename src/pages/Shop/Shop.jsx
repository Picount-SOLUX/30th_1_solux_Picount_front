import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Shop.css";
import api from "../../api/axiosInstance";
import SkinBookModal from "./SkinSelectorBook";

function Shop() {
  const [shopItems, setShopItems] = useState([]);
  const [point, setPoint] = useState(0);
  const [message, setMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchPoint = async () => {
    try {
      const res = await api.get("/points/my");
      if (res.data.success) {
        setPoint(res.data.data.point);
      }
    } catch (err) {
      console.error("포인트 조회 실패", err);
    }
  };

  const fetchItems = async () => {
    try {
      const [cakeRes, calendarRes, webRes] = await Promise.all([
        api.get("/items/cake-skins"),
        api.get("/items/calendar-skins"),
        api.get("/items/web-skins"),
      ]);

      const cake = cakeRes.data.data.map((item) => ({
        ...item,
        category: "케이크 꾸미기 스킨",
        image: item.imageUrl,
      }));
      const calendar = calendarRes.data.data.map((item) => ({
        ...item,
        category: "달력 꾸미기 스킨",
        image: item.imageUrl,
      }));
      const web = webRes.data.data.map((item) => ({
        ...item,
        category: "테마 색상 변경",
        image: item.imageUrl,
      }));

      setShopItems([...cake, ...calendar, ...web]);
    } catch (err) {
      console.error("상품 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchPoint();
  }, []);

  const handlePurchase = async (itemId) => {
    try {
      const res = await api.post("/items/purchases", { itemId });
      if (res.data.success) {
        setMessage(`🎉 ${res.data.message}`);
        fetchPoint(); // ✅ 구매 성공 시 포인트 다시 불러오기
      } else {
        setMessage(`⚠️ ${res.data.message}`);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ 서버 오류 발생");
      }
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const categories = [
    "케이크 꾸미기 스킨",
    "달력 꾸미기 스킨",
    "테마 색상 변경",
  ];

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div className="point-box">
          <span className="point-label">사용 가능 포인트</span>
          <div className="point-value">
            <span>P</span>
            <strong>{point.toLocaleString()} p</strong>
          </div>
        </div>

        <div className="shop-header">
          <button className="preview-btn" onClick={() => setPreviewOpen(true)}>
            미리보기
          </button>
        </div>
      </div>

      {previewOpen && (
        <SkinBookModal
          ownedItems={shopItems}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {message && <div className="purchase-message">{message}</div>}

      {categories.map((category) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="item-grid">
            {shopItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item.itemId} className="shop-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-footer">
                    <span className="item-price">{item.price} p</span>
                    <button
                      className="buy-btn"
                      onClick={() => handlePurchase(item.itemId)}
                    >
                      구매
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shop;
