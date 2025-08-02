import React from "react";
import styles from "./ReportModal.module.css";
import MiniCalendar from "./MiniCalendar";

export default function ReportModal({ year, month, reportData, onClose }) {
  if (!reportData) return null;

  const { emotionCount, positiveExpense, negativeExpense, insight } =
    reportData;
  const emotions = [
    "행복",
    "뿌듯",
    "평온",
    "우울",
    "분노",
    "불안",
    "피곤",
    "그냥",
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          X
        </button>
        <h2>{month}월 감정 기반 소비 리포트</h2>
        <div className={styles.sectionRow}>
          <div className={styles.section}>
            <h3>{month}월 미니 캘린더</h3>
            <MiniCalendar year={year} month={month} />
          </div>

          <div className={styles.section}>
            <h3>감정 스티커 사용 내역</h3>
            <div className={styles.stickerGrid}>
              {emotions.map((emotion) => (
                <div key={emotion} className={styles.stickerItem}>
                  <img
                    src={`/stickers/감정스티커 ${
                      emotions.indexOf(emotion) + 1
                    }.png`}
                    alt={emotion}
                  />
                  <span>{emotion}</span>
                  <strong>{emotionCount[emotion] || 0}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <p>긍정적 감정 소비 총합: {positiveExpense.toLocaleString()}원</p>
            <p>부정적 감정 소비 총합: {negativeExpense.toLocaleString()}원</p>
          </div>

          <div className={styles.section}>
            <p className={styles.insight}>{insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
