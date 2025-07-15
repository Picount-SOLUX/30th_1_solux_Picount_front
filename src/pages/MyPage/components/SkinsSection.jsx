import React from "react";
import styles from "./SkinsSection.module.css";

export default function SkinsSection() {
  const skins = [
    { id: 1, name: "아이스크림", image: null },
    { id: 2, name: "체리", image: null },
    { id: 3, name: null, image: null },
    { id: 4, name: null, image: null },
    { id: 5, name: null, image: null },
    { id: 6, name: null, image: null },
  ];

  return (
    <div className={styles.skinsSection}>
      <div className={styles.title}>보유한 꾸미기 스킨</div>
      <div className={styles.skinGrid}>
        {skins.map((skin) => (
          <div key={skin.id} className={styles.skinItem}>
            {skin.image ? (
              <img
                src={skin.image}
                alt={skin.name}
                className={styles.skinImage}
              />
            ) : (
              <div className={styles.emptyBox}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
