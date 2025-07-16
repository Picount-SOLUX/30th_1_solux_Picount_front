import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsSection.module.css";

export default function SettingsSection() {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className={styles.settingsSection}>
      <button className={styles.settingsButton} onClick={goToSettings}>
        설정
      </button>
    </div>
  );
}
