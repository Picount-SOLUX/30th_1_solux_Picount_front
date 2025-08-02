import React, { useState, useEffect } from "react";
import styles from "./CalendarSkinModal.module.css";
import useSkin from "../../../context/useSkin";
import api from "../../../api/axiosInstance";

export default function CalendarSkinModal({ onClose }) {
  const { setCalendarSkinUrl } = useSkin();
  //   const [ownedSkins, setOwnedSkins] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState("default");

  const skinMap = {
    default: "cal_default_frame.png",
    chang: "cal_chang_frame.png",
    tomato: "cal_tomato_frame.png",
    tiara: "cal_tiara_frame.png",
    angel: "cal_angel_frame.png",
  };
  const ownedSkins = ["default", "chang", "tomato"];

  //   useEffect(() => {
  //     const fetchOwnedSkins = async () => {
  //       try {
  //         const res = await api.get("/items/my-calendar-skins");
  //         if (res.data.success) {
  //           setOwnedSkins(res.data.data.map((item) => item.name.toLowerCase()));
  //         }
  //       } catch (err) {
  //         console.error("스킨 조회 실패:", err);
  //       }
  //     };
  //     fetchOwnedSkins();
  //   }, []);

  const handleApply = () => {
    if (!selectedSkin) return;

    setCalendarSkinUrl({
      backgroundUrl: "",
      frameUrl: skinMap[selectedSkin],
      frameSize: "contain",
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.bookModal} onClick={(e) => e.stopPropagation()}>
        {/* 스프링 4줄 */}
        <img
          className={styles.spring1}
          src="/assets/cakes/Spring.png"
          alt="spring"
        />
        <img
          className={styles.spring2}
          src="/assets/cakes/Spring.png"
          alt="spring"
        />
        <img
          className={styles.spring3}
          src="/assets/cakes/Spring.png"
          alt="spring"
        />
        <img
          className={styles.spring4}
          src="/assets/cakes/Spring.png"
          alt="spring"
        />

        <div className={styles.pages}>
          {/* 왼쪽 페이지 */}
          <div className={`${styles.bookPage} ${styles.leftPage}`}>
            {selectedSkin ? (
              <img
                src={`/assets/ShopItems/CalendarSkin/${skinMap[selectedSkin]}`}
                alt={selectedSkin}
                className={styles.previewImage}
              />
            ) : (
              <div className={styles.placeholder}>스킨을 선택해주세요</div>
            )}
          </div>

          {/* 오른쪽 페이지 */}
          <div className={`${styles.bookPage} ${styles.rightPage}`}>
            <h3>보유한 달력 스킨</h3>
            <div className={styles.skinList}>
              {ownedSkins.map((skin) => (
                <div
                  key={skin}
                  className={`${styles.skinItem} ${
                    selectedSkin === skin ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedSkin(skin)}
                >
                  <img
                    src={`/assets/ShopItems/CalendarSkin/${skinMap[skin]}`}
                    alt={skin}
                    className={styles.skinImage}
                  />
                </div>
              ))}
            </div>

            <button className={styles.applyBtn} onClick={handleApply}>
              적용
            </button>

            {/* <div className={styles.frameSelector}>
              <span className={styles.label}>프레임 선택:</span>
              {["default", "chang", "tomato", "tiara", "angel"].map((frame) => {
                const isOwned = ownedSkins.includes(frame);
                return (
                  <button
                    key={frame}
                    className={`${styles.frameBtn} ${
                      !isOwned ? styles.disabled : ""
                    }`}
                    onClick={() => isOwned && setSelectedSkin(frame)}
                    disabled={!isOwned}
                  >
                    {frame === "default"
                      ? "기본"
                      : frame.charAt(0).toUpperCase() + frame.slice(1)}
                  </button>
                );
              })}
            </div> */}
          </div>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
