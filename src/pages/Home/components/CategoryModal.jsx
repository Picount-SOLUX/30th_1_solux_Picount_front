// ✅ CategoryModal.jsx (카테고리 추가/수정/삭제)
import React, { useState } from "react";
import styles from "./CategoryModal.module.css";

export default function CategoryModal({ onClose, categories, setCategories }) {
  const [activeTab, setActiveTab] = useState("expense");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = (index) => {
    setCategories((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== index),
    }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const nextId =
      categories[activeTab].length > 0
        ? Math.max(...categories[activeTab].map((c) => c.id)) + 1
        : 1;
    const newItem = { id: nextId, name: newCategory };
    setCategories((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem],
    }));
    setNewCategory("");
    setShowAddModal(false);
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;
    setCategories((prev) => {
      const updated = [...prev[activeTab]];
      updated[editIndex] = {
        ...updated[editIndex],
        name: editName,
      };
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
            <div key={cat.id} className={styles.row}>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(idx)}
              >
                <span className={styles.deleteCircle}>–</span>
              </button>
              <span className={styles.name}>{cat.name}</span>
              <button
                className={styles.editBtn}
                onClick={() => {
                  setEditIndex(idx);
                  setEditName(cat.name);
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

        {/* 추가 모달 */}
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

        {/* 수정 모달 */}
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
