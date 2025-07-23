import React from "react";
import styles from "./CategoryModal.module.css";

export default function CategoryModal({ onClose }) {
  const categories = ["식비", "교통비", "취미", "쇼핑", "고정비", "기타"];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <strong>카테고리</strong>
        </div>

        {/* 카테고리 항목들 */}
        <div className={styles.categoryList}>
          {categories.map((cat, idx) => (
            <div key={idx} className={styles.row}>
              <button className={styles.deleteBtn}>
                <span className={styles.deleteCircle}>–</span>
              </button>
              <span className={styles.name}>{cat}</span>
              <button className={styles.editBtn}>✎</button>
            </div>
          ))}
        </div>

        {/* 추가 버튼 */}
        <div className={styles.addRow}>
          <button className={styles.addBtn}>＋</button>
        </div>

        {/* 완료 버튼 */}
        <button className={styles.doneBtn} onClick={onClose}>
          완료
        </button>
      </div>
    </div>
  );
}
