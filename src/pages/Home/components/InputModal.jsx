import React, { useState, useRef } from "react";
import styles from "./InputModal.module.css";

export default function InputModal({ onClose }) {
  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [date, setDate] = useState(formatDate(today));
  const [rows, setRows] = useState([
    { category: "", amount: "" },
    { category: "", amount: "" },
  ]);
  const [type, setType] = useState("expense");
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

  const handleSubmit = () => {
    const data = {
      date,
      type,
      entries: rows,
      memo,
      photo,
    };
    console.log("가계부 등록 데이터:", data);
    onClose();
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={styles.dateInput}
        />

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
    </div>
  );
}
