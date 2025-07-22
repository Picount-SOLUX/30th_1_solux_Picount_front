import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./InputModal.module.css";
import CategoryModal from "./CategoryModal";

export default function InputModal({
  onClose,
  onSubmit,
  initialData,
  calendarData,
  isEditMode = false,
  onOpenCategoryModal,
}) {
  const [initialized, setInitialized] = useState(false);
  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  // 날짜 상태 분리
  const [date, setDate] = useState(formatDate(today)); // 최종 제출용
  const [inputDate, setInputDate] = useState(formatDate(today)); // input 바인딩용

  const [type, setType] = useState("expense");
  const [incomeRows, setIncomeRows] = useState([{ category: "", amount: "" }]);
  const [expenseRows, setExpenseRows] = useState([
    { category: "", amount: "" },
  ]);
  const rows = type === "income" ? incomeRows : expenseRows;
  const setRows = type === "income" ? setIncomeRows : setExpenseRows;

  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState(null);

  const containerRef = useRef();

  const formatWithComma = (value) => {
    const number = value.replace(/[^0-9]/g, "");
    return Number(number).toLocaleString();
  };

  const handleAmountChange = (index, value) => {
    const updated = [...rows];
    updated[index].amount = formatWithComma(value);
    setRows(updated);
  };

  const handleCategoryChange = (index, value) => {
    const updated = [...rows];
    updated[index].category = value;
    setRows(updated);
  };

  const handleAddRow = () => {
    setRows([...rows, { category: "", amount: "" }]);
  };

  const handleAddAmount = (index, plus) => {
    const current = Number(rows[index].amount.replace(/,/g, "")) || 0;
    const updated = [...rows];
    updated[index].amount = formatWithComma((current + plus).toString());
    setRows(updated);
  };

  const handleOverlayClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    const ownerId = localStorage.getItem("ownerId"); // ✅ 로그인 시 저장한 ID

    const entries = [
      ...incomeRows.map((row) => ({ ...row, type: "income" })),
      ...expenseRows.map((row) => ({ ...row, type: "expense" })),
    ];

    const payload = {
      date,
      ownerId,
      memo,
      entries,
    };

    try {
      if (isEditMode) {
        // ✅ 수정 요청
        await axios.put("/api/calendar/record", payload);
      } else {
        // ✅ 작성 요청
        await axios.post("/api/calendar/record", payload);
      }

      onSubmit?.(payload);
      onClose();
    } catch (e) {
      console.error("가계부 저장 실패:", e);
      alert("가계부 저장에 실패했습니다.");
    }
  };

  const expenseCategories = [
    "식비",
    "교통비",
    "취미",
    "쇼핑",
    "고정비",
    "기타",
    "저축",
  ];
  const incomeCategories = ["월급", "용돈", "기타"];

  const handleDeleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated.length > 0 ? updated : [{ category: "", amount: "" }]);
  };
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const handleOpenCategoryModal = () => {
    onClose(); // InputModal 닫기
    setTimeout(() => {
      onOpenCategoryModal?.(); // 상위에서 CategoryModal 열기
    }, 200);
  };

  useEffect(() => {
    if (initialData && !initialized) {
      setDate(initialData.date);
      setInputDate(initialData.date);
      setMemo(initialData.memo || "");
      setPhoto(initialData.photo || null);

      const income =
        initialData.entries?.filter((e) => e.type === "income") || [];
      const expense =
        initialData.entries?.filter((e) => e.type === "expense") || [];

      setIncomeRows(
        income.length > 0
          ? income.map((e) => ({ ...e }))
          : [{ category: "", amount: "" }]
      );
      setExpenseRows(
        expense.length > 0
          ? expense.map((e) => ({ ...e }))
          : [{ category: "", amount: "" }]
      );

      setType("expense");
      setInitialized(true);
    }
  }, [initialData, initialized]);

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} ref={containerRef}>
        <div className={styles.tabGroup}>
          <button
            className={
              type === "income" ? styles.tabActive : styles.tabInactive
            }
            onClick={() => setType("income")}
          >
            수입
          </button>
          <button
            className={
              type === "expense" ? styles.tabActive : styles.tabInactive
            }
            onClick={() => setType("expense")}
          >
            지출
          </button>
        </div>

        <label className={styles.label}>날짜</label>
        <input
          type="date"
          value={inputDate}
          onChange={(e) => {
            setInputDate(e.target.value);
            setDate(e.target.value); // ✅ 함께 업데이트
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "8px",
          }}
        >
          <button
            className={styles.categoryEditBtn}
            onClick={handleOpenCategoryModal}
          >
            카테고리 수정
          </button>
        </div>

        {rows.map((row, idx) => (
          <div key={idx} className={styles.amountRow}>
            <select
              className={styles.categorySelect}
              value={row.category}
              onChange={(e) => handleCategoryChange(idx, e.target.value)}
              required
            >
              <option value="" disabled hidden>
                카테고리
              </option>
              {(type === "expense" ? expenseCategories : incomeCategories).map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>

            <input
              className={styles.amountInput}
              value={row.amount}
              onChange={(e) => handleAmountChange(idx, e.target.value)}
            />
            <span className={styles.won}>원</span>
            {[100, 1000, 10000].map((amt) => (
              <button
                key={amt}
                className={styles.plusBtn}
                onClick={() => handleAddAmount(idx, amt)}
              >
                +{amt.toLocaleString()}
              </button>
            ))}

            {/* 버튼 영역 */}
            {isEditMode ? (
              // 수정 모드에서는 삭제 버튼. 단, 유일한 빈 항목만 있으면 생략
              !(
                rows.length === 1 &&
                row.category === "" &&
                row.amount === ""
              ) && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteRow(idx)}
                >
                  <span className={styles.deleteCircle}>–</span>
                </button>
              )
            ) : (
              // 작성 모드에서는 항상 + 버튼
              <button className={styles.addRowBtn} onClick={handleAddRow}>
                +
              </button>
            )}
          </div>
        ))}

        <button className={styles.addRowBtn} onClick={handleAddRow}>
          +
        </button>

        <textarea
          className={styles.memo}
          placeholder="메모"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        ></textarea>
        <input
          id="upload-photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          style={{ display: "none" }}
        />

        <label htmlFor="upload-photo" className={styles.photoBtn}>
          파일 업로드 ⬆
        </label>

        <div className={styles.submitRow}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            입력
          </button>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
      {showCategoryModal && (
        <CategoryModal onClose={() => setShowCategoryModal(false)} />
      )}
    </div>
  );
}
