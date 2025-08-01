// src/pages/Home/components/CalendarSkinModal.jsx
import React, { useState, useEffect } from "react";
import styles from "./CalendarSkinModal.module.css";
import api from "../../../api/axiosInstance";

export default function CalendarSkinModal({ onClose, onApply }) {
  const [ownedSkins, setOwnedSkins] = useState([]);
  const [tempSkin, setTempSkin] = useState(null);

  const fetchOwnedCalendarSkins = async () => {
    try {
      const res = await api.get("/items/my-calendar-skins");
      if (res.data.success) {
        setOwnedSkins(res.data.data);
      }
    } catch (err) {
      console.error("달력 스킨 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchOwnedCalendarSkins();
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.bookModal} onClick={(e) => e.stopPropagation()}>
        {/* 스프링 4줄 */}
        {[1, 2, 3, 4].map((n, i) => (
          <img
            key={i}
            className={styles[`spring${n}`]}
            src="/assets/cakes/Spring.png"
            alt="spring"
          />
        ))}

        <div className={styles.pages}>
          {/* 왼쪽 페이지 */}
          <div className={`${styles.page} ${styles.left}`}>
            {tempSkin ? (
              <img
                src={tempSkin.imageUrl}
                alt="선택한 스킨"
                className={styles.previewImage}
              />
            ) : (
              <p className={styles.placeholder}>스킨을 선택해주세요</p>
            )}
          </div>

          {/* 오른쪽 페이지 */}
          <div className={`${styles.page} ${styles.right}`}>
            <h3>보유한 달력 스킨</h3>
            <div className={styles.skinList}>
              {ownedSkins.map((skin) => (
                <div
                  key={skin.itemId}
                  className={`${styles.skinItem} ${
                    tempSkin?.itemId === skin.itemId ? styles.selected : ""
                  }`}
                  onClick={() => setTempSkin(skin)}
                >
                  <img
                    src={skin.imageUrl}
                    alt={skin.name}
                    className={styles.skinImage}
                  />
                </div>
              ))}
            </div>

            <button
              className={styles.applyBtn}
              onClick={() => {
                if (tempSkin) {
                  onApply(tempSkin);
                  onClose();
                }
              }}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
