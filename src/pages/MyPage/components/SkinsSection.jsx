import React from "react";
import styles from "./SkinsSection.module.css";

export default function SkinsSection() {
  const skins = [
    { id: 1, name: "생크림", image: "/skins/꾸미기 스킨 1.png" },
    { id: 2, name: "체리", image: "/skins/꾸미기 스킨 2.png" },
    { id: 3, name: "꽃", image: "/skins/꾸미기 스킨 3.png" },
    { id: 4, name: "데코크림", image: "/skins/꾸미기 스킨 4.png" },
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
