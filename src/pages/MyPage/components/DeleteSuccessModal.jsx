import React from "react";
import styles from "./DeleteSuccessModal.module.css";

export default function DeleteSuccessModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <p className={styles.completeText}>
          <strong>탈퇴가 완료되었습니다.</strong>
        </p>
        <p className={styles.thankText}>
          그동안 서비스를 이용해주셔서 감사합니다.
        </p>
        <button className={styles.confirmButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
