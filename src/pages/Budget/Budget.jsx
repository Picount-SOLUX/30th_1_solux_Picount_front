import React, { useState, useEffect } from "react";
import BudgetGraph from "./components/BudgetGraph";
import BudgetDetail from "./components/BudgetDetail";
import DatePicker from "react-datepicker"; // 달력
import "react-datepicker/dist/react-datepicker.css"; // 스타일
import "./Budget.css";
import { getCategories, getActiveBudget, updateBudgetPlan } from "../../api/BudgetAPI";

export default function Budget() {
  const jobData = [
    {
      title: "중·고등학생",
      description: "소액 소비와 식비, 교재비 지출 중심의 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 30 },
        { label: "교통비", percent: 15 },
        { label: "교재비", percent: 30 },
        { label: "쇼핑/문화", percent: 10 },
        { label: "기타", percent: 15 },
      ],
    },
    {
      title: "대학생",
      description:
        "식비와 월세 등의 고정비, 모임 비중이 높으며 저축도 고려한 예산입니다.",
      budgets: [
        { label: "식비", percent: 25 },
        { label: "교통비", percent: 10 },
        { label: "고정비(월세)", percent: 20 },
        { label: "모임/약속", percent: 15 },
        { label: "쇼핑/문화", percent: 10 },
        { label: "저축", percent: 10 },
        { label: "기타", percent: 10 },
      ],
    },
    {
      title: "전업주부",
      description: "가족 중심 소비 패턴에 최적화된 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 35 },
        { label: "생활용품", percent: 25 },
        { label: "자녀교육", percent: 15 },
        { label: "교통비", percent: 10 },
        { label: "저축", percent: 10 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "2030대 직장인",
      description: "고정지출과 저축을 균형있게 고려한 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 25 },
        { label: "고정비", percent: 30 },
        { label: "교통비", percent: 10 },
        { label: "취미/자기계발", percent: 10 },
        { label: "저축/투자", percent: 20 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "4050대 직장인",
      description: "고정지출과 자녀교육 지출 비중이 큰 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 20 },
        { label: "고정지출", percent: 35 },
        { label: "자녀교육", percent: 20 },
        { label: "저축/투자", percent: 20 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "프리랜서",
      description: "유동적인 소득에 맞춘 예산 분배를 고려했습니다.",
      budgets: [
        { label: "식비", percent: 20 },
        { label: "업무비(장비)", percent: 20 },
        { label: "고정지출", percent: 15 },
        { label: "저축/투자", percent: 20 },
        { label: "자기계발", percent: 15 },
        { label: "기타", percent: 10 },
      ],
    },
    {
      title: "기타",
      description: "일반적인 상황에 맞춘 기본 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 20 },
        { label: "고정지출", percent: 20 },
        { label: "저축", percent: 20 },
        { label: "기타", percent: 40 },
      ],
    },
  ];

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });
  const [showHelp, setShowHelp] = useState(true);

  // 날짜 상태 추가
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  ); // 기본: 오늘부터 한 달

  const selectedJob = localStorage.getItem("selectedJob");
  const selectedBudget = parseInt(
    localStorage.getItem("selectedBudget")?.replace(/[^0-9]/g, "") || "0"
  );

  const jobInfo = jobData.find((job) => job.title === selectedJob);

  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(); // 전체 조회 API 사용
        const categories = res.data.data.categories;
        console.log("카테고리 불러오기 성공:", categories);

        // 중복 제거 + 이름만 추출
        const expenseCategories = categories.filter(cat => cat.type === "EXPENSE");
        const names = [...new Set(expenseCategories.map((cat) => cat.categoryName))];        
        setCategoryOptions(names);
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const fetchActiveBudget = async () => {
  //     try {
  //       const res = await getActiveBudget();
  //       const data = res.data.data;

  //       const serverCategories = data.budgetAllocationList.map((item) => ({
  //         id: item.budgetAllocationId,
  //         name: item.categoryName,
  //         amount: item.amount.toString(),
  //       }));

  //       setCategories(serverCategories);
  //       localStorage.setItem("budgetCategories", JSON.stringify(serverCategories));
  //       localStorage.setItem("budgetId", data.budgetId); // PUT용으로 저장
  //     } catch (err) {
  //       console.error("활성화된 예산 가져오기 실패", err);
  //     }
  //   };

  //   fetchActiveBudget();
  // }, []);

  // 🔥 InfoSteps 값으로 기본 예산 세팅
  useEffect(() => {
    // const localCategories = localStorage.getItem("budgetCategories");
    // const hasActiveBudget = localCategories && JSON.parse(localCategories).length > 0;

    if (jobInfo && selectedBudget > 0) {
      const initializedCategories = jobInfo.budgets.map((item, idx) => ({
        id: idx + 1,
        name: item.label,
        amount: Math.round((selectedBudget * item.percent) / 100).toString(),
      }));
      setCategories(initializedCategories);
      localStorage.setItem(
        "budgetCategories",
        JSON.stringify(initializedCategories)
      );
    }
  }, [selectedJob, selectedBudget]); // ✅ 값 바뀔 때마다 실행

  // endDate가 지났을 때 카테고리 초기화
  useEffect(() => {
    const now = new Date();
    if (endDate < now) {
      setCategories([]);
      localStorage.removeItem("budgetCategories");
    }
  }, [endDate]);

  const getTotalBudget = (list) =>
    list.reduce((sum, cat) => sum + parseInt(cat.amount || 0), 0);

  const totalBudget = isEditing
    ? getTotalBudget(tempCategories)
    : getTotalBudget(categories);

  // 수정 버튼
  const handleEditClick = () => {
    setIsEditing(true);
    setTempCategories([...categories]);
  };

  // 저장 버튼
  const handleSaveClick = async () => {
    try {
      const budgetId = localStorage.getItem("budgetId");
      if (!budgetId) {
        throw new Error("예산 ID 없음");
      }
      const startDate = localStorage.getItem("budgetStartDate");
      const endDate = localStorage.getItem("budgetEndDate");
      const totalAmount = localStorage.getItem("budgetTotalAmount");
      if (!startDate || !endDate || !totalAmount) {
        throw new Error("예산 필수 정보 누락");
      }
      const payload = {
        startDate,
        endDate,
        totalAmount: parseInt(totalAmount),
        budgetAllocationList: tempCategories.map((cat) => ({
          categoryId: cat.categoryId,
          amount: parseInt(cat.amount),
        })),
      };
      console.log("보내는 payload", payload.budgetAllocationList);
      console.log("여기까진 오냐?")
      //const res = await updateBudgetPlan(budgetId, payload); // PUT 요청
      //console.log("세부예산 수정 완료:", res)
      setCategories([...tempCategories]);
      localStorage.setItem("budgetCategories", JSON.stringify(tempCategories));
      setIsEditing(false);
      alert("저장되었습니다.");
    } catch (error) {
      console.error("예산 저장 실패", error);
      alert("예산 저장 중 오류 발생");
    }
  };

  const handleInputChange = (id, field, value) => {
    setTempCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className='budget-wrapper'>
      <BudgetGraph
        categories={categories}
        isEditing={isEditing}
        tempCategories={tempCategories}
        totalBudget={totalBudget}
        jobInfo={jobInfo}
        showHelp={!showHelp}
        toggleHelp={toggleHelp}
      />

      <BudgetDetail
        isEditing={isEditing}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        categories={categories}
        tempCategories={tempCategories}
        handleInputChange={handleInputChange}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        totalBudget={totalBudget}
        categoryOptions={categoryOptions}
      />
    </div>
  );
}