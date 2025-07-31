import React, { useState } from "react";
import axios from "axios";
import InputModal from "./InputModal";
import ViewModal from "./ViewModal";
import styles from "./calendar.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableDay from "./DroppableDay";
import StickerItem from "./StickerItem";
// import themeStyles from "../../../styles/CalendarThemes.module.css";
import useTheme from "../../../hooks/useTheme";
import { useEffect } from "react";
import "../../../styles/CalendarThemes.css";
import CategoryModal from "./CategoryModal";
import ReportModal from "./ReportModal";
import useSkin from "../../../context/useSkin";
import api from "../../../api/axiosInstance";
import FrameSelector from "./FrameSelector";

function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [placedStickers, setPlacedStickers] = useState({});
  const [calendarData, setCalendarData] = useState({});
  const { setCalendarSkinUrl, calendarSkinUrl } = useSkin();

  const [ownerId, setOwnerId] = useState(() => localStorage.getItem("ownerId"));

  const stickerList = [
    { id: 1, src: "/stickers/감정스티커 1.png", emotion: "행복" },
    { id: 2, src: "/stickers/감정스티커 2.png", emotion: "뿌듯" },
    { id: 3, src: "/stickers/감정스티커 3.png", emotion: "평온" },
    { id: 4, src: "/stickers/감정스티커 4.png", emotion: "우울" },
    { id: 5, src: "/stickers/감정스티커 5.png", emotion: "분노" },
    { id: 6, src: "/stickers/감정스티커 6.png", emotion: "불안" },
    { id: 7, src: "/stickers/감정스티커 7.png", emotion: "피곤" },
    { id: 8, src: "/stickers/감정스티커 8.png", emotion: "그냥" },
  ];

  const handleStickerDrop = async (dateStr, emotionObj) => {
    if (!ownerId) {
      console.error("❌ ownerId가 없습니다. 로그인 정보를 확인하세요.");
      return;
    }

    console.log("📤 POST /calendar/emotion", {
      date: dateStr,
      emotion: emotionObj.emotion,
      ownerId,
    });

    try {
      const res = await api.post("/calendar/emotion", {
        date: dateStr,
        emotion: emotionObj.emotion,
        // ownerId 생략 가능!
      });

      const result = res.data;

      if (result.success) {
        setPlacedStickers((prev) => ({
          ...prev,
          [dateStr]: emotionObj.src, // 표시용 src는 그대로
        }));
      } else {
        console.warn("스티커 등록 실패:", result.message);
      }
    } catch (e) {
      console.error("스티커 등록 실패 (에러)", e);
    }
  };

  const handleStickerDelete = async (dateStr) => {
    try {
      const res = await api.delete(`/calendar/emotion?date=${dateStr}`);
      const result = res.data;

      if (result.status === "success") {
        setPlacedStickers((prev) => {
          const newData = { ...prev };
          delete newData[dateStr];
          return newData;
        });
      } else {
        console.warn("삭제 응답 실패:", result.message);
      }
    } catch (e) {
      console.error("스티커 삭제 실패", e);
    }
  };

  // Calendar.jsx

  // 1. handleModalSubmit 함수 수정
  const handleModalSubmit = async (newEntry) => {
    // 해당 날짜의 최신 데이터를 서버에서 다시 가져오기
    const ownerId = localStorage.getItem("userId");
    try {
      const res = await api.get(
        `/calendar/record?date=${newEntry.date}&ownerId=${ownerId}`
      );
      const result = res.data;

      if (result.success && result.data) {
        const { memo, incomes, expenses, imageUrls } = result.data;

        const combinedEntries = [
          ...incomes.map((item) => ({
            type: "income",
            category: item.categoryName,
            amount: item.amount.toLocaleString(), // 서버에서 오는 숫자를 포맷
          })),
          ...expenses.map((item) => ({
            type: "expense",
            category: item.categoryName,
            amount: item.amount.toLocaleString(), // 서버에서 오는 숫자를 포맷
          })),
        ];

        const updatedData = {
          date: newEntry.date,
          memo,
          photo: imageUrls?.[0] || null,
          entries: combinedEntries,
        };

        // calendarData 업데이트
        setCalendarData((prev) => ({
          ...prev,
          [newEntry.date]: updatedData,
        }));
      }
    } catch (error) {
      console.error("데이터 새로고침 실패:", error);
      // 실패 시 전달받은 데이터로라도 업데이트
      setCalendarData((prev) => ({
        ...prev,
        [newEntry.date]: newEntry,
      }));
    }
    // 모달 닫기
    setIsInputOpen(false);
    setEditData(null);
  };

  const [editData, setEditData] = useState(null);

  const { themeKey, updateTheme } = useTheme();

  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => today.getFullYear() - 5 + i
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i);

  const handleYearChange = (e) => setCurrentYear(Number(e.target.value));
  const handleMonthChange = (e) => setCurrentMonth(Number(e.target.value));

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const getFirstDayOfMonth = () =>
    new Date(currentYear, currentMonth, 1).getDay();
  const getDaysInMonth = () =>
    new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDayClick = async (dateStr) => {
    try {
      const res = await api.get(
        `/calendar/record?date=${dateStr}&ownerId=${ownerId}`
      );
      const result = res.data;

      if (result.success && result.data) {
        const { memo, incomes, expenses, imageUrls } = result.data;

        const combinedEntries = [
          ...incomes.map((item) => ({
            type: "income",
            category: item.categoryName,
            amount: item.amount,
          })),
          ...expenses.map((item) => ({
            type: "expense",
            category: item.categoryName,
            amount: item.amount,
          })),
        ];

        setViewData({
          date: dateStr,
          memo,
          photo: imageUrls?.[0] || null, // 첫 번째 이미지만 처리
          entries: combinedEntries,
        });
      }
    } catch (e) {
      console.error("해당 날짜 가계부 불러오기 실패", e);
    }
  };

  // useEffect(() => {
  //   setCalendarSkinUrl({

  //     frameUrl: "cal_chang_frame.png",
  //   });
  // }, [setCalendarSkinUrl]);

  // useEffect(() => {
  //   setCalendarSkinUrl({
  //     backgroundUrl: "",
  //     frameUrl: "cal_tomato_frame.png",
  //     frameSize: "contain",
  //   });
  // }, [setCalendarSkinUrl]);

  useEffect(() => {
    setCalendarSkinUrl({
      backgroundUrl: "", // 배경 이미지가 필요 없다면 빈 문자열
      frameUrl: "cal_tiara_frame.png",
      frameSize: "contain", // 필요에 따라 "cover", "100% auto" 도 가능
    });
  }, [setCalendarSkinUrl]);

  useEffect(() => {
    const fetchCalendarSummary = async () => {
      try {
        const res = await api.get(
          `/calendar/summary?year=${currentYear}&month=${
            currentMonth + 1
          }&ownerId=${ownerId}`
        );
        const result = res.data;

        if (result.success && result.data?.summary) {
          const summaryArray = result.data.summary;

          const summaryObj = {};
          summaryArray.forEach((item) => {
            summaryObj[item.date] = item;
          });

          setCalendarData(summaryObj);
        } else {
          console.warn("달력 요약 데이터 없음");
        }
      } catch (err) {
        console.error("요약 불러오기 실패", err);
      }
    };

    fetchCalendarSummary();
  }, [ownerId, currentYear, currentMonth]);

  useEffect(() => {
    if (showReport) {
      const fetchEmotionReport = async () => {
        try {
          const res = await api.get(
            `/calendar/report/emotion?year=${currentYear}&month=${
              currentMonth + 1
            }`
          );
          const result = res.data;
          if (result.success) {
            setReportData(result.data);
          } else {
            alert("리포트 조회 실패: " + result.message);
          }
        } catch (e) {
          console.error("리포트 조회 중 에러", e);
        }
      };

      fetchEmotionReport();
    }
  }, [showReport, currentYear, currentMonth]);

  const fetchEmotionReport = async () => {
    try {
      const res = await api.get(
        `/calendar/report/emotion?year=${currentYear}&month=${currentMonth + 1}`
      );
      const result = res.data;
      if (result.success) {
        setReportData(result.data);
      } else {
        alert("리포트 조회 실패: " + result.message);
      }
    } catch (e) {
      console.error("리포트 조회 중 에러", e);
    }
  };

  const [showInputModal, setShowInputModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState({
    income: ["월급", "용돈"],
    expense: ["식비", "교통비", "취미", "쇼핑", "고정비", "기타"],
  }); /* 카테고리 관련을 예산 설정 페이지에서랑 같이 관리하게 될수도 따로 팔수도*/

  const renderDays = () => {
    const firstDay = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();
    const prevDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];
    for (let i = 0; i < 42; i++) {
      let date, isCurrentMonth;
      if (i < firstDay) {
        date = prevDaysInMonth - firstDay + i + 1;
        isCurrentMonth = false;
      } else if (i < firstDay + daysInMonth) {
        date = i - firstDay + 1;
        isCurrentMonth = true;
      } else {
        date = i - (firstDay + daysInMonth) + 1;
        isCurrentMonth = false;
      }

      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(date).padStart(2, "0")}`;

      cells.push(
        <DroppableDay
          key={`day-${i}`}
          date={dateStr}
          stickerSrc={placedStickers[dateStr]}
          onDrop={handleStickerDrop}
          isCurrentMonth={isCurrentMonth}
          onClick={handleDayClick}
          onStickerDelete={handleStickerDelete}
        >
          <span className={styles.date}>{date}</span>
          {isCurrentMonth &&
            (() => {
              const data = calendarData[dateStr];
              let totalIncome = 0;
              let totalExpense = 0;

              if (data?.entries?.length) {
                data.entries.forEach((entry) => {
                  const amount = Number(entry.amount.replace(/,/g, "")) || 0;
                  if (entry.type === "income") totalIncome += amount;
                  else if (entry.type === "expense") totalExpense += amount;
                });
              }

              return (
                <>
                  <div className={styles.income}>
                    {totalIncome > 0 ? `+${totalIncome.toLocaleString()}` : ""}
                  </div>
                  <div className={styles.expense}>
                    {totalExpense > 0
                      ? `-${totalExpense.toLocaleString()}`
                      : ""}
                  </div>
                </>
              );
            })()}
        </DroppableDay>
      );
    }
    return cells;
  };

  return (
    <div className={`${themeKey}-theme`}>
      <div
        className={styles.calendarContainer}
        style={
          calendarSkinUrl?.backgroundUrl
            ? {
                "--bg-img": `url('/assets/ShopItems/CalendarSkin/${calendarSkinUrl.backgroundUrl}')`,
              }
            : {}
        }
      >
        {/* 프레임 오버레이 */}
        {calendarSkinUrl?.frameUrl && (
          <div
            className={styles.frameOverlay}
            style={{
              backgroundImage: `url('/assets/ShopItems/CalendarSkin/${calendarSkinUrl.frameUrl}')`,

              backgroundSize: calendarSkinUrl.frameSize || "contain",
            }}
          />
        )}

        <DndProvider backend={HTML5Backend}>
          {/* 드롭다운 + 월말 리포트 버튼 */}
          <div className={styles.headerRow}>
            <div className={styles.selectBox}>
              <select
                value={currentYear}
                onChange={handleYearChange}
                className={styles.dropdown}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                className={styles.dropdown}
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month + 1}
                  </option>
                ))}
              </select>
              <button
                className={styles.reportBtn}
                onClick={() => setShowReport(true)}
              >
                월말 리포트 보기 📝
              </button>
            </div>

            {/* 오른쪽: 감정 스티커 바 */}
            <div className={styles.stickerBar}>
              <div className={styles.stickerTrack}>
                {stickerList.map((sticker) => (
                  <StickerItem
                    key={sticker.id}
                    src={sticker.src}
                    emotion={sticker.emotion}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 요일 */}
          <div className={styles.weekdays}>
            {["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"].map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          {/* 달력 날짜 */}
          <div className={styles.days}>{renderDays()}</div>

          {/* 작성 floating 버튼 */}
          <button
            className={styles.floatingEditBtn}
            onClick={() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const existingData = calendarData[todayStr] || null;
              setEditData(existingData);
              setIsInputOpen(true);
            }}
          >
            ✏️
          </button>

          {/* InputModal */}
          {isInputOpen && (
            <InputModal
              categories={categories}
              initialData={editData}
              isEditMode={!!editData}
              calendarData={calendarData}
              onClose={() => {
                setIsInputOpen(false);
                setEditData(null);
              }}
              onSubmit={(data) => {
                setCalendarData((prev) => ({
                  ...prev,
                  [data.date]: data,
                }));
                setIsInputOpen(false);
                setEditData(null);
              }}
              onOpenCategoryModal={() => {
                setShowInputModal(false);
                setIsInputOpen(false);
                setShowCategoryModal(true);
              }}
            />
          )}

          {/* ViewModal */}
          {viewData && (
            <ViewModal
              data={viewData}
              onClose={() => setViewData(null)}
              onEdit={() => {
                setEditData(viewData);
                setIsInputOpen(true);
                setViewData(null);
              }}
            />
          )}


            {isInputOpen && (
              <InputModal
                categories={categories}
                initialData={editData}
                isEditMode={!editData}
                calendarData={calendarData}
                onClose={() => {
                  setEditData(null);
                  setIsInputOpen(false);
                }}
                onSubmit={handleModalSubmit}
                onOpenCategoryModal={() => {
                  setShowInputModal(false);
                  setIsInputOpen(false);
                  setShowCategoryModal(true);
                }}
              />
            )}

          {/* ReportModal */}
          {showReport && reportData && (
            <ReportModal
              year={currentYear}
              month={currentMonth + 1}
              reportData={reportData}
              onClose={() => {
                setShowReport(false);
                setReportData(null);
              }}
            />
          )}
        </DndProvider>
      </div>
      <FrameSelector />
    </div>
  );
}

export default Calendar;
