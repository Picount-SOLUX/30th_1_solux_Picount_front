import React, { useState, useRef } from "react";
import styles from "./FriendAddButton.module.css";
import FriendCodeModal from "./FriendCodeModal";

export default function FriendAddButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const handleAddByCode = () => {
    setShowModal(true);
    setShowMenu(false);
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.plusButton} onClick={toggleMenu}>
        ＋
      </button>

      {showMenu && (
        <div className={styles.menu}>
          <div className={styles.menuItem} onClick={handleAddByCode}>
            <span> 친구 코드로 친구 추가</span>
          </div>
          <div className={styles.menuItem}>
            <span> 카카오톡으로 친구 추가</span>
          </div>
        </div>
      )}

      {showModal && <FriendCodeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
