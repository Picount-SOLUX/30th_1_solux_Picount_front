import React from "react";
import { useDrag } from "react-dnd";

export default function StickerItem({ src }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "sticker",
    item: { src },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <img
      ref={drag}
      src={src}
      alt="sticker"
      style={{
        width: 32,
        height: 32,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    />
  );
}
