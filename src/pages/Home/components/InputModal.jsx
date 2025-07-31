import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./InputModal.module.css";
import CategoryModal from "./CategoryModal";
import api from "../../../api/axiosInstance";
import { getCategories } from "../../../api/BudgetAPI";


export default function InputModal({
  onClose,
  categories,
  onSubmit,
  initialData,
  isEditMode = false,
  onOpenCategoryModal,
}) {
  const [initialized, setInitialized] = useState(false);
  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [date, setDate] = useState(formatDate(today));
  const [inputDate, setInputDate] = useState(formatDate(today));

  const [type, setType] = useState("expense");
  const [incomeRows, setIncomeRows] = useState([{ category: "", amount: "" }]);
  const [expenseRows, setExpenseRows] = useState([
    { category: "", amount: "" },
  ]);
  const rows = type === "income" ? incomeRows : expenseRows;
  const setRows = type === "income" ? setIncomeRows : setExpenseRows;

  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");

  const containerRef = useRef();

  const formatWithComma = (value) => {
    const number = value.replace(/[^0-9]/g, "");
    return Number(number).toLocaleString();
  };

  const getCategoryId = (type, name) => {
    const list = fetchedCategories?.[type] || [];
    const match = list.find((c) => c.name === name);
    return match?.id || null;
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

  useEffect(() => {
    console.log("현재 모드:", isEditMode ? "수정 모드" : "입력 모드");
  }, [isEditMode]);

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
  const ownerId = localStorage.getItem("userId");

  try {
    let prevIncomeList = [];
    let prevExpenseList = [];

    if (isEditMode) { // 수정 모드가 아닌 입력 모드일 때
      const fetchRes = await api.patch(`/calendar/record?date=${date}`);
      const prevData = fetchRes.data?.data || {};
      prevIncomeList = prevData.incomes || [];
      prevExpenseList = prevData.expenses || [];
    }

    const newIncomeList = incomeRows
      .filter((row) => row.category && row.amount)
      .map((row) => ({
        categoryId: getCategoryId("income", row.category),
        categoryName: row.category,
        amount: Number(row.amount.replace(/,/g, "")),
      }));

    const newExpenseList = expenseRows
      .filter((row) => row.category && row.amount)
      .map((row) => ({
        categoryId: getCategoryId("expense", row.category),
        categoryName: row.category,
        amount: Number(row.amount.replace(/,/g, "")),
      }));

    const formData = new FormData();
    formData.append("ownerId", ownerId);
    formData.append("entryDate", date);
    formData.append("memo", memo);
    formData.append(
      "incomeList",
      JSON.stringify(
        isEditMode ? [...prevIncomeList, ...newIncomeList] : newIncomeList
      )
    );
    formData.append(
      "expenseList",
      JSON.stringify(
        isEditMode ? [...prevExpenseList, ...newExpenseList] : newExpenseList
      )
    );
    if (photo) formData.append("photos", photo);

    const res = isEditMode
      ? await api.patch("/calendar/record?date=${date}", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      : await api.post("/calendar/record", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const updatedData = {
      date: formattedDate,
      memo,
      photo: photo ? URL.createObjectURL(photo) : preview,
      entries: [
        ...newIncomeList.map((item) => ({
          type: "income",
          category: item.categoryName,
          amount: item.amount.toLocaleString(),
        })),
        ...newExpenseList.map((item) => ({
          type: "expense",
          category: item.categoryName,
          amount: item.amount.toLocaleString(),
        })),
      ],
    };

    console.log("🧪 updatedData.date:", updatedData.date);
    onSubmit?.(updatedData);
    onClose();
  } catch (e) {
    console.error("가계부 저장 실패:", e);
  }
};

  const handleDeleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated.length > 0 ? updated : [{ category: "", amount: "" }]);
  };

  const handleOpenCategoryModal = () => {
    onClose();
    setTimeout(() => {
      onOpenCategoryModal?.();
    }, 200);
  };

  useEffect(() => {
    if (initialData && !initialized) {
      setDate(initialData.date);
      setInputDate(initialData.date);
      setMemo(initialData.memo || "");
      setPhoto(initialData.photo || null);
      setPreview(initialData.photo || null);

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

  useEffect(() => {
    const fetchExistingData = async () => {
      const ownerId = localStorage.getItem("userId");
      try {
        const res = await api.get(
          `/calendar/record?date=${inputDate}&ownerId=${ownerId}`
        );
        const result = res.data;

        if (result.success && result.data) {
          const { memo, incomes, expenses } = result.data;
          setMemo(memo || "");
          setIncomeRows(
            incomes.length > 0
              ? incomes.map((e) => ({
                  category: e.categoryName,
                  amount: e.amount.toString(),
                }))
              : [{ category: "", amount: "" }]
          );
          setExpenseRows(
            expenses.length > 0
              ? expenses.map((e) => ({
                  category: e.categoryName,
                  amount: e.amount.toString(),
                }))
              : [{ category: "", amount: "" }]
          );
        }
      } catch (e) {
        console.log("선택한 날짜에 기존 데이터 없음");
      }
    };

    if (!isEditMode && !initialized) {
      fetchExistingData();
    }
  }, [inputDate, isEditMode, initialized]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const [fetchedCategories, setFetchedCategories] = useState({ income: [], expense: [] });
  useEffect(() => {
    const fetchCategories = async () => {
      // const ownerId = localStorage.getItem("userId");

      try {
        const res = await getCategories();
        console.log("카테고리 GET API 응답:", res);
        const categoryList = res.data?.data || [];
        console.log("categoryList:", categoryList);

        const categoriesArray = categoryList.categories || [];
        console.log("categoriesArray", categoriesArray)
        // 수입/지출 분류
        const income = categoriesArray
          .filter((c) => c.type === "INCOME")
          .map((c) => ({ id: c.categoryId, name: c.categoryName }));

        const expense = categoriesArray
          .filter((c) => c.type === "EXPENSE")
          .map((c) => ({ id: c.categoryId, name: c.categoryName }));

        console.log("income:", income);
        console.log("expense:", expense);
        setFetchedCategories({ income, expense });
      } catch (e) {
        console.error("카테고리 불러오기 실패:", e);
      }
    };

    fetchCategories();
  }, []);


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
            setDate(e.target.value);
          }}
          disabled={!isEditMode}
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
            카테고리 수정/추가/삭제
          </button>
        </div>

        {rows.map((row, idx) => (
          <div key={idx} className={styles.amountRow}>
            <select
              value={row.category}
              onChange={(e) => handleCategoryChange(idx, e.target.value)}
            >
              <option value="">카테고리</option>
              {fetchedCategories[type].length === 0 ? (
                <option disabled>카테고리 불러오는 중...</option>
              ) : (
                fetchedCategories[type].map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
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

            {isEditMode &&
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

        <div className={styles.photoBox}>
          {preview && (
            <img src={preview} alt="preview" className={styles.previewImage} />
          )}
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="upload-photo" className={styles.photoBtn}>
            사진 업로드 ⬆
          </label>
        </div>

        {/* {isEditMode && preview && (
          <div className={styles.photoBox}>
            <img
              src={preview}
              alt="기존 사진 미리보기"
              className={styles.previewImage}
            />
            <label htmlFor="upload-photo" className={styles.changePhotoLabel}>
              사진 교체하기
            </label>
          </div>
        )}

        {!isEditMode && (
          <label htmlFor="upload-photo" className={styles.photoBtn}>
            사진 업로드 ⬆
          </label>
        )} */}

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
