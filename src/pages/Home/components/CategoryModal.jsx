import React, { useEffect, useState } from "react";
import styles from "./CategoryModal.module.css";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/BudgetAPI";

export default function CategoryModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("EXPENSE");
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // 인덱스 저장
  const [editName, setEditName] = useState("");

  // 카테고리 서버에서 불러오기
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res.data?.data?.categories || [];
      setCategories(list);
    } catch (e) {
      console.error("카테고리 불러오기 실패", e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 카테고리 추가
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("카테고리 이름을 입력하세요");
      return;
    }
    try {
      await createCategory({
        name: newCategory.trim(),
        type: activeTab,
      });
      setNewCategory("");
      setShowAddModal(false);
      fetchCategories();
    } catch (e) {
      console.error("카테고리 추가 실패", e);
    }
  };

  // 카테고리 수정 저장
  const handleEditSave = async () => {
    if (!editName.trim()) {
      alert("수정할 이름을 입력하세요");
      return;
    }
    try {
      const categoryToEdit = filteredCategories[editIndex];
      await updateCategory(categoryToEdit.categoryId, {
        name: editName.trim(),
      });
      setShowEditModal(false);
      setEditIndex(null);
      setEditName("");
      fetchCategories();
    } catch (e) {
      console.error("카테고리 수정 실패", e);
    }
  };

  // 삭제
  const handleDelete = async (categoryId) => {
    console.log("삭제 시도 중, categoryId:", categoryId); // 이게 안 찍히면 버튼 자체 문제
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await deleteCategory(categoryId);
      console.log("카테고리 삭제 API 성공", res)
      fetchCategories();
    } catch (e) {
      console.error("카테고리 삭제 실패", e);
    }
  };

  // 탭에 따른 필터링
  const filteredCategories = categories.filter(
    (cat) => cat.type === activeTab
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.tabGroup}>
          <button
            className={activeTab === "INCOME" ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab("INCOME")}
          >
            수입
          </button>
          <button
            className={activeTab === "EXPENSE" ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab("EXPENSE")}
          >
            지출
          </button>
        </div>

        <div className={styles.categoryList}>
          {filteredCategories.map((cat, idx) => (
            <div key={cat.categoryId} className={styles.row}>
              
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  console.log("버튼 클릭됨");
                  handleDelete(cat.categoryId);
                }}
              >
                <span className={styles.deleteCircle}>–</span>
              </button>
              <span className={styles.name}>{cat.categoryName}</span>
              
              <button
                className={styles.editBtn}
                onClick={() => {
                  setEditIndex(idx);
                  setEditName(cat.categoryName);
                  setShowEditModal(true);
                }}
              >
                ✎
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addRow}>
          
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
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
                <button className={styles.confirmBtn} onClick={handleAddCategory}>
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
