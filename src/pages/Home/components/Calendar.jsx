import React, { useState } from "react";
import InputModal from "./InputModal";
import ViewModal from "./ViewModal";
import styles from "./calendar.module.css";
import Draggable from "react-draggable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableDay from "./DroppableDay";
import StickerItem from "./StickerItem";

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
  const handleStickerDrop = (dateStr, src) => {
    setPlacedStickers((prev) => ({
      ...prev,
      [dateStr]: src, // 하루 하나만
    }));
  };
  // const handleStickerClick = (src) => {
  //   // 초기 위치는 캘린더 중앙 위로 고정 (나중에 드래그)
  //   setPlacedStickers((prev) => [
  //     ...prev,
  //     { id: Date.now(), src, x: 100, y: 100 },
  //   ]);
  // };
  const [editData, setEditData] = useState(null);

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

  const sampleData = {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15`,
    entries: [
      { type: "income", category: "월급", amount: "3,000,000" },
      { type: "expense", category: "식비", amount: "20,000" },
    ],
    memo: "카페에서 점심",
    photo: null,
  };

  const handleDayClick = (date) => {
    const data = calendarData[date];
    if (data) {
      setViewData({ ...data, date });
    } else {
      setViewData(null);
    }
  };
  const handleStickerDelete = (dateStr) => {
    setPlacedStickers((prev) => {
      const newData = { ...prev };
      delete newData[dateStr];
      return newData;
    });
  };
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
    <DndProvider backend={HTML5Backend}>
      <div className={styles.calendarContainer}>
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
      </div>
    </DndProvider>
  );
}

export default Calendar;
