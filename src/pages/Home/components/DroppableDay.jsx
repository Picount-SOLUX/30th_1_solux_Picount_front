import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import styles from "./calendar.module.css";

export default function DroppableDay({
  date,
  stickerSrc,
  onDrop,
  isCurrentMonth = true,
  onClick = () => {},
  children,
}) {
  const wasDropped = useRef(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "sticker",
    canDrop: () => isCurrentMonth,
    drop: (item) => {
      onDrop?.(date, item.src);
      wasDropped.current = true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleClick = () => {
    if (wasDropped.current) {
      wasDropped.current = false;
      return;
    }
    if (isCurrentMonth && typeof onClick === "function") {
      onClick(date);
    }
  };

  return (
    <div
      ref={drop}
      className={`${styles.day} ${!isCurrentMonth ? styles.outside : ""}`}
      onClick={handleClick}
      style={{
        position: "relative",
        backgroundColor: isOver ? "#ffe4e4" : undefined,
        cursor: isCurrentMonth ? "pointer" : "default",
      }}
    >
      {children}
      {isCurrentMonth && stickerSrc && (
        <img
          src={stickerSrc}
          alt="sticker"
          style={{
            width: 28,
            height: 28,
            position: "absolute",
            top: 4,
            right: 4,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
