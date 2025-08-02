import React, { useState, useEffect, useCallback } from "react";
import InputModal from "./InputModal";
import ViewModal from "./ViewModal";
import styles from "./calendar.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableDay from "./DroppableDay";
import StickerItem from "./StickerItem";
import useTheme from "../../../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import "../../../styles/CalendarThemes.css";
import CategoryModal from "./CategoryModal";
import ReportModal from "./ReportModal";
import useSkin from "../../../context/useSkin";
import api from "../../../api/axiosInstance";
import FrameSelector from "./FrameSelector";
import CalendarSkinModal from "./CalendarSkinModal";
import "./CalendarTheme.css";

function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // calendarData 상태는 localStorage 'localEntries'에서 초기화 (한번만)
  const [calendarData, setCalendarData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("localEntries") || "{}");
    } catch {
      return {};
    }
  });

  const [placedStickers, setPlacedStickers] = useState({});
  const { setCalendarSkinUrl, calendarSkinUrl } = useSkin();
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);
  const [calendarSkin, setCalendarSkin] = useState(null);
  const navigate = useNavigate();

  const [ownerId] = useState(() => localStorage.getItem("userId"));

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

  const fetchEmotionReport = useCallback(async () => {
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
  }, [currentYear, currentMonth]);

  useEffect(() => {
    const saved = localStorage.getItem("placedStickers");
    if (saved) {
      setPlacedStickers(JSON.parse(saved));
    }
  }, []);

  const handleStickerDrop = (dateStr, emotionObj) => {
    // placedStickers 상태 업데이트
    setPlacedStickers((prev) => {
      const updated = {
        ...prev,
        [dateStr]: emotionObj.src,
      };

      // localStorage에 저장
      localStorage.setItem("placedStickers", JSON.stringify(updated));
      return updated;
    });
  };

  const handleStickerDelete = (dateStr) => {
    setPlacedStickers((prev) => {
      const updated = { ...prev };
      delete updated[dateStr];

      // localStorage에 반영
      localStorage.setItem("placedStickers", JSON.stringify(updated));
      return updated;
    });
  };

  // const handleModalSubmit = async (newEntry) => {
  //   const localKey = "calendar-records";

  //   // 1. newEntry 반영 (일단 달력에 보여줌)
  //   setCalendarData((prev) => ({
  //     ...prev,
  //     [newEntry.date]: newEntry,
  //   }));

  //   // 2. 서버 요청
  //   try {
  //     const res = await api.get(`/calendar/record?date=${newEntry.date}`);
  //     console.log("📦 API 응답 데이터:", res.data);
  //     const result = res.data;

  //     const isValidServerData =
  //       result.success &&
  //       result.data &&
  //       (result.data.incomes?.length > 0 || result.data.expenses?.length > 0);

  //     if (isValidServerData) {
  //       const { memo, incomes, expenses, imageUrls } = result.data;

  //       const combinedEntries = [
  //         ...incomes.map((item) => ({
  //           type: "income",
  //           amount: item.amount.toLocaleString(),
  //         })),
  //         ...expenses.map((item) => ({
  //           type: "expense",
  //           amount: item.amount.toLocaleString(),
  //         })),
  //       ];

  //       const updatedData = {
  //         date: newEntry.date,
  //         memo,
  //         photo: imageUrls?.[0] || null,
  //         entries: combinedEntries,
  //       };

  //       setCalendarData((prev) => ({
  //         ...prev,
  //         [newEntry.date]: updatedData,
  //       }));

  //       return; // 서버 데이터가 유효했으면 여기서 종료
  //     }
  //   } catch (error) {
  //     console.warn("🌐 서버 새로고침 실패:", error);
  //   }

  //   // 3. 로컬 데이터 fallback
  //   const localData = JSON.parse(localStorage.getItem(localKey) || "{}");
  //   const fallbackData = localData[newEntry.date];

  //   if (fallbackData) {
  //     console.log("📁 로컬 데이터로 대체:", fallbackData);
  //     setCalendarData((prev) => ({
  //       ...prev,
  //       [newEntry.date]: fallbackData,
  //     }));
  //   }

  //   // 4. 모달 닫기
  //   setIsInputOpen(false);
  //   setEditData(null);
  // };

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
    // 🟡 로컬 데이터 불러오기
    const localData = JSON.parse(localStorage.getItem("localEntries") || "{}");
    const localRecord = localData[dateStr];

    const localEntriesForDate = Array.isArray(localRecord?.entries)
      ? localRecord.entries
      : [];

    // 초기 memo, photo도 로컬에서 설정
    let memo = localRecord?.memo || "";
    let photo = localRecord?.photo || null;

    try {
      const res = await api.get(
        `/calendar/record?date=${dateStr}&ownerId=${ownerId}`
      );
      const result = res.data;

      if (result.success && result.data) {
        const { incomes, expenses, imageUrls, memo: serverMemo } = result.data;

        // 서버 데이터 가공
        const serverEntries = [
          ...(Array.isArray(incomes)
            ? incomes.map((item) => ({
                type: "income",
                category: item.categoryName,
                amount: item.amount,
              }))
            : []),
          ...(Array.isArray(expenses)
            ? expenses.map((item) => ({
                type: "expense",
                category: item.categoryName,
                amount: item.amount,
              }))
            : []),
        ];

        // 서버 메모/이미지 우선 적용
        memo = serverMemo ?? memo;
        photo = imageUrls?.[0] || photo;

        // 서버 + 로컬 데이터 결합
        const combinedEntries = [...serverEntries, ...localEntriesForDate];

        setViewData({
          date: dateStr,
          memo,
          photo,
          entries: combinedEntries,
        });

        return; // 성공 시 여기서 끝
      }
    } catch (e) {
      console.warn("서버 가계부 불러오기 실패. 로컬 데이터만 사용합니다.", e);
    }

    // 서버 실패 시에도 로컬 데이터만으로 뷰 표시
    if (localEntriesForDate.length > 0 || memo || photo) {
      setViewData({
        date: dateStr,
        memo,
        photo,
        entries: localEntriesForDate,
      });
    } else {
      console.log("서버/로컬 모두 데이터 없음.");
    }
  };

  // calendarData 상태가 변경될 때마다 localStorage에 저장 (단일 useEffect)
  useEffect(() => {
    if (calendarData && Object.keys(calendarData).length > 0) {
      localStorage.setItem("localEntries", JSON.stringify(calendarData));
    }
  }, [calendarData]);

  // currentYear, currentMonth, ownerId 변경 시 서버에서 요약 데이터 받아와 calendarData에 병합
  useEffect(() => {
    if (!ownerId) return;

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

          setCalendarData((prev) => ({
            ...prev,
            ...summaryObj,
          }));
        } else {
          console.warn("달력 요약 데이터 없음");
        }
      } catch (err) {
        console.error("요약 불러오기 실패", err);
      }
    };

    fetchCalendarSummary();
  }, [ownerId, currentYear, currentMonth]);

  // showReport가 true일 때 감정 리포트 불러오기
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

  const [showInputModal, setShowInputModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState({
    income: ["월급", "용돈"],
    expense: ["식비", "교통비", "취미", "쇼핑", "고정비", "기타"],
  }); /* 카테고리 관련은 예산 설정 페이지와 공유 혹은 별도 관리 가능 */

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
                  let amount = 0;

                  if (entry.amount != null) {
                    if (typeof entry.amount === "string") {
                      amount = Number(entry.amount.replace(/,/g, ""));
                    } else if (typeof entry.amount === "number") {
                      amount = entry.amount;
                    } else {
                      amount = Number(String(entry.amount).replace(/,/g, ""));
                    }
                  }
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

  useEffect(() => {
    if (showReport) {
      fetchEmotionReport();
    }
  }, [showReport, currentYear, currentMonth, fetchEmotionReport]);

  return (
    <div className='calendar-wrapper'>
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
                  onClick={() => {
                    navigate(
                      `/report?year=${currentYear}&month=${currentMonth + 1}`
                    );
                  }}
                >
                  월말 리포트 보기 📝
                </button>
              </div>

              {showReport && (
                <ReportModal
                  year={currentYear}
                  month={currentMonth + 1}
                  reportData={
                    reportData || {
                      emotionCount: {},
                      positiveExpense: 0,
                      negativeExpense: 0,
                      insight: "데이터가 없습니다.",
                    }
                  }
                  onClose={() => {
                    setShowReport(false);
                    setReportData(null);
                  }}
                />
              )}

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
              {["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"].map(
                (day) => (
                  <div key={day} className={styles.weekday}>
                    {day}
                  </div>
                )
              )}
            </div>

            {/* 달력 날짜 */}
            <div className={styles.days}>{renderDays()}</div>

            {/* 작성 floating 버튼 */}
            <button
              className={styles.floatingEditBtn}
              onClick={() => {
                const todayStr = new Date().toISOString().split("T")[0];
                const existingData = calendarData[todayStr] || null;
                setEditData({
                  date: todayStr,
                  entries: [],
                  memo: "",
                  photo: null,
                });
                setIsInputOpen(true);
              }}
            >
              <img src='/assets/icons/calInput-button.png' alt='작성' />
            </button>

            {/* InputModal */}
            {isInputOpen && (
              <InputModal
                categories={categories}
                initialData={editData}
                isEditMode={!editData}
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

            {showCategoryModal && (
              <CategoryModal
                onClose={() => setShowCategoryModal(false)}
                categories={categories}
                setCategories={setCategories}
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
        <button
          className='edit-skin-btn'
          onClick={() => setIsSkinModalOpen(true)}
        >
          스킨 변경
        </button>

        {isSkinModalOpen && (
          <CalendarSkinModal
            onClose={() => setIsSkinModalOpen(false)}
            onApply={(skin) => setCalendarSkin(skin)}
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;