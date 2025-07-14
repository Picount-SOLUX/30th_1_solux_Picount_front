import React, { useState } from "react";
import styles from "./calendar.module.css";

const Calendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => today.getFullYear() - 5 + i
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i);

  const handleYearChange = (e) => {
    setCurrentYear(Number(e.target.value));
  };
  const handleMonthChange = (e) => {
    setCurrentMonth(Number(e.target.value));
  };
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

      cells.push(
        <div
          key={`day-${i}`}
          className={`${styles.day} ${!isCurrentMonth ? styles.outside : ""}`}
        >
          <span className={styles.date}>{date}</span>
          {isCurrentMonth && (
            <>
              <div className={styles.income}>+00,000</div>
              <div className={styles.expense}>-0,000</div>
            </>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
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
            <div className={styles.stickerItem}>🐻</div>
            <div className={styles.stickerItem}>🌼</div>
            <div className={styles.stickerItem}>🍓</div>
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
      <button className={styles.floatingEditBtn}>✏️</button>
    </div>
  );
};

export default Calendar;