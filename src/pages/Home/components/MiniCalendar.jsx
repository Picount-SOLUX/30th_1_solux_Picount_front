// src/components/MiniCalendar.jsx
import React from "react";
import styles from "./MiniCalendar.module.css";

export default function MiniCalendar({ year, month }) {
  const getFirstDay = () => new Date(year, month - 1, 1).getDay();
  const getDaysInMonth = () => new Date(year, month, 0).getDate();

  const firstDay = getFirstDay();
  const daysInMonth = getDaysInMonth();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className={styles.empty}></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(
      <div key={`day-${i}`} className={styles.day}>
        {i}
      </div>
    );
  }

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.header}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.body}>{cells}</div>
    </div>
  );
}
