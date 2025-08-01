import React from "react";
import styles from "./FrameSelector.module.css";
import useSkin from "../../../context/useSkin";

export default function FrameSelector() {
  const { setCalendarSkinUrl } = useSkin();

  const frames = [
    { name: "기본", value: null },
    { name: "Chang", value: "cal_chang_frame.png" },
    { name: "Tomato", value: "cal_tomato_frame.png" },
    { name: "Tiara", value: "cal_tiara_frame.png" },
    { name: "Angel", value: "cal_angel_frame.png" },
  ];

  return (
    <div className={styles.frameSelector}>
      <span className={styles.label}>프레임 선택:</span>
      {frames.map((frame) => (
        <button
          key={frame.name}
          onClick={() =>
            setCalendarSkinUrl({
              backgroundUrl: "", // 필요시 frame마다 설정 가능
              frameUrl: frame.value,
              frameSize: "contain",
            })
          }
          className={styles.frameBtn}
        >
          {frame.name}
        </button>
      ))}
    </div>
  );
}
