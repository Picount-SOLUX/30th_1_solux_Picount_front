import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmotionReportPage.module.css";
import MiniCalendar from "../components/MiniCalendar";
import api from "../../../api/axiosInstance";

export default function EmotionReportPage() {
  const navigate = useNavigate();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reportData, setReportData] = useState(null);

  const fetchReport = useCallback(async () => {
    try {
      const res = await api.get("/calendar/report/emotion", {
        params: {
          year: year.toString(),
          month: month.toString().padStart(2, "0"),
        },
      });

      if (res.data.success) {
        setReportData(res.data.data);
      } else {
        setReportData(null);
      }
    } catch (err) {
      console.error("리포트 조회 실패", err);
      setReportData(null);
    }
  }, [year, month]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const {
    emotionCount = {},
    positiveExpense = 0,
    negativeExpense = 0,
    insight = "데이터가 없습니다.",
  } = reportData || {};

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
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        &lt; 되돌아가기
      </button>

      <div className={styles.dropdownRow}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
      </div>

      <h2>{month}월 감정 기반 소비 리포트</h2>

      <div className={styles.sectionRow}>
        <div className={styles.section}>
          <h3>미니 캘린더</h3>
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
      </div>

      <div className={styles.section}>
        <p>긍정적 감정 소비 총합: {positiveExpense.toLocaleString()}원</p>
        <p>부정적 감정 소비 총합: {negativeExpense.toLocaleString()}원</p>
      </div>

      <div className={styles.section}>
        <p className={styles.insight}>{insight}</p>
      </div>
    </div>
  );
}
