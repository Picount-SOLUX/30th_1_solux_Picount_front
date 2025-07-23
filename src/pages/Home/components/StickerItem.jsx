import React from "react";
import { useDrag } from "react-dnd";

// emotion prop도 받도록 추가
export default function StickerItem({ src, emotion }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "sticker",
    item: { src, emotion },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <img
      ref={drag}
      src={src}
      alt={emotion}
      style={{
        width: 32,
        height: 32,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    />
  );
}
