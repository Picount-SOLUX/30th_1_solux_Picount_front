import React from "react";
import Draggable from "react-draggable";
import styles from "./calendar.module.css";

function Sticker({ src, defaultPosition }) {
  return (
    <Draggable defaultPosition={defaultPosition}>
      <img src={src} alt="sticker" className={styles.placedSticker} />
    </Draggable>
  );
}

export default Sticker;
