import React from "react";
import styles from "./SettingsSection.module.css";

export default function SettingsSection() {
  const settings = [
    { id: 1, label: "이용 가이드 보기", onClick: () => alert("이용 가이드") },
    { id: 2, label: "로그아웃", onClick: () => alert("로그아웃 처리") },
    { id: 3, label: "회원 탈퇴", onClick: () => alert("회원 탈퇴 절차") },
  ];

  return (
    <div className={styles.settingsSection}>
      <div className={styles.title}>설정</div>
      <ul className={styles.settingsList}>
        {settings.map((item) => (
          <li key={item.id} className={styles.item} onClick={item.onClick}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
