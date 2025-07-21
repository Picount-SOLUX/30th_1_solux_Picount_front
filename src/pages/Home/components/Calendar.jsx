import React, { useState } from "react";
import axios from "axios";
import InputModal from "./InputModal";
import ViewModal from "./ViewModal";
import styles from "./calendar.module.css";
import Draggable from "react-draggable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableDay from "./DroppableDay";
import StickerItem from "./StickerItem";
// import themeStyles from "../../../styles/CalendarThemes.module.css";
import useTheme from "../../../hooks/useTheme";
import { useEffect } from "react";
import "../../../styles/CalendarThemes.css"; // CSS module 아님
import CategoryModal from "./CategoryModal";

function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [placedStickers, setPlacedStickers] = useState({});
  const [calendarData, setCalendarData] = useState({});

  const stickerList = [
    { id: 1, src: "/stickers/감정스티커 1.png" },
    { id: 2, src: "/stickers/감정스티커 2.png" },
    { id: 3, src: "/stickers/감정스티커 3.png" },
    { id: 4, src: "/stickers/감정스티커 4.png" },
    { id: 5, src: "/stickers/감정스티커 5.png" },
    { id: 6, src: "/stickers/감정스티커 6.png" },
    { id: 7, src: "/stickers/감정스티커 7.png" },
    { id: 8, src: "/stickers/감정스티커 8.png" },
  ];
  const handleStickerDrop = async (dateStr, src) => {
    // try {
    //   await axios.post("/api/calendar/emotion", {
    //     date: dateStr,
    //     stickerUrl: src,
    //   });
    //   setPlacedStickers((prev) => ({
    //     ...prev,
    //     [dateStr]: src,
    //   }));
    // } catch (e) {
    //   console.error("스티커 등록 실패", e);
    // }
  };

  const handleStickerDelete = async (dateStr) => {
    // try {
    //   await axios.delete(`/api/calendar/emotion?data=YYYY-MM-DD`, {
    //     data: { date: dateStr },
    //   });
    //   setPlacedStickers((prev) => {
    //     const newData = { ...prev };
    //     delete newData[dateStr];
    //     return newData;
    //   });
    // } catch (e) {
    //   console.error("스티커 삭제 실패", e);
    // }
  };
  const [editData, setEditData] = useState(null);

  const { themeKey, updateTheme } = useTheme();

  useEffect(() => {
    const dummyData = {
      "2025-07-20": {
        entries: [
          { type: "income", category: "용돈", amount: "10000" },
          { type: "expense", category: "점심", amount: "5000" },
        ],
        memo: "테스트 메모",
        photo: null,
      },
      "2025-07-22": {
        entries: [{ type: "expense", category: "카페", amount: "4300" }],
      },
    };

    const dummyStickers = {
      "2025-07-20": "/stickers/감정스티커 3.png",
      "2025-07-22": "/stickers/감정스티커 5.png",
    };

    setCalendarData(dummyData);
    setPlacedStickers(dummyStickers);
  }, []);

  useEffect(() => {
    console.log("현재 테마:", themeKey); // ✅ 여기서 확인!
    updateTheme("angel"); // 테스트용
  }, [themeKey, updateTheme]);

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
    // try {
    //   const res = await axios.get(
    //     `/api/calendar/record?date=YYYY-MM-DD&ownerId={ownerId}`
    //   );
    //   const data = res.data;
    //   if (data) {
    //     setViewData({ ...data, date: dateStr });
    //   }
    // } catch (e) {
    //   console.error("해당 날짜 가계부 불러오기 실패", e);
    // }
  };

  const [showInputModal, setShowInputModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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
      <div className={styles.calendarContainer}>
        <DndProvider backend={HTML5Backend}>
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
            </div>

            <div className={styles.stickerBar}>
              <div className={styles.stickerTrack}>
                {stickerList.map((sticker) => (
                  <StickerItem key={sticker.id} src={sticker.src} />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.weekdays}>
            {["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"].map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.days}>{renderDays()}</div>

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

          {isInputOpen && (
            <InputModal
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
                setShowInputModal(false); // InputModal 닫기
                setIsInputOpen(false);
                setShowCategoryModal(true); // CategoryModal 열기
              }}
            />
          )}

          {viewData && (
            <ViewModal
              data={viewData}
              onClose={() => setViewData(null)}
              onEdit={() => {
                setEditData(viewData); // ✅ 수정 데이터 저장
                setIsInputOpen(true);
                setViewData(null);
              }}
            />
          )}
          {/* {placedStickers.map((sticker) => (
            <Sticker
              key={sticker.id}
              src={sticker.src}
              defaultPosition={{ x: sticker.x, y: sticker.y }}
            />
          ))} */}
          {showCategoryModal && (
            <CategoryModal onClose={() => setShowCategoryModal(false)} />
          )}
        </DndProvider>
      </div>
    </div>
  );
}

export default Calendar;
