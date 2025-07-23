import React, { useState } from "react";
import styles from "./CategoryModal.module.css";

export default function CategoryModal({ onClose, categories, setCategories }) {
  const [activeTab, setActiveTab] = useState("expense");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleDelete = (index) => {
    setCategories((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== index),
    }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setCategories((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newCategory],
    }));
    setNewCategory("");
    setShowAddModal(false);
  };

  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditSave = () => {
    if (!editName.trim()) return;
    setCategories((prev) => {
      const updated = [...prev[activeTab]];
      updated[editIndex] = editName;
      return {
        ...prev,
        [activeTab]: updated,
      };
    });
    setShowEditModal(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.tabGroup}>
          <button
            className={
              activeTab === "income" ? styles.tabActive : styles.tabInactive
            }
            onClick={() => setActiveTab("income")}
          >
            수입
          </button>
          <button
            className={
              activeTab === "expense" ? styles.tabActive : styles.tabInactive
            }
            onClick={() => setActiveTab("expense")}
          >
            지출
          </button>
        </div>

        <div className={styles.categoryList}>
          {categories[activeTab].map((cat, idx) => (
            <div key={idx} className={styles.row}>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(idx)}
              >
                <span className={styles.deleteCircle}>–</span>
              </button>
              <span className={styles.name}>{cat}</span>
              <button
                className={styles.editBtn}
                onClick={() => {
                  setEditIndex(idx);
                  setEditName(cat);
                  setShowEditModal(true);
                }}
              >
                ✎
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addRow}>
          <button
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            ＋
          </button>
        </div>

        <button className={styles.doneBtn} onClick={onClose}>
          완료
        </button>

        {/* 추가 입력용 모달 */}
        {showAddModal && (
          <div className={styles.innerModalOverlay}>
            <div className={styles.innerModal}>
              <input
                type="text"
                className={styles.input}
                placeholder="새 카테고리 입력"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <div className={styles.modalButtons}>
                <button
                  className={styles.confirmBtn}
                  onClick={handleAddCategory}
                >
                  저장
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className={styles.innerModalOverlay}>
            <div className={styles.innerModal}>
              <input
                type="text"
                className={styles.input}
                placeholder="수정할 이름 입력"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <div className={styles.modalButtons}>
                <button className={styles.confirmBtn} onClick={handleEditSave}>
                  저장
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowEditModal(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
