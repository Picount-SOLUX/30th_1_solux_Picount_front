import React from "react";
import styles from "./DeleteAccountModal.module.css";

export default function DeleteAccountModal({ onClose, onConfirm }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>회원탈퇴</h2>
        <p className={styles.description}>
          탈퇴 시 해당 계정에 저장된 모든 데이터가 사라지며 <br />
          동일한 계정으로 재가입하더라도 복구가 불가능합니다.
        </p>
        <p className={styles.confirmText}>탈퇴하시겠습니까??</p>
        <button className={styles.confirmButton} onClick={onConfirm}>
          탈퇴
        </button>
      </div>
    </div>
  );
}
