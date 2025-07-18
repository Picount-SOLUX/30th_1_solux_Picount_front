import React from "react";
import styles from "./MyPage.module.css";
import ProfileSection from "./components/ProfileSection";
import FriendsSection from "./components/FriendsSection";
import SkinsSection from "./components/SkinsSection";
import GuestbookSection from "./components/GuestbookSection";
import SettingsSection from "./components/SettingsSection";

export default function MyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.profileRow}>
        <ProfileSection />
      </div>

      <SkinsSection />
      <GuestbookSection />
      <SettingsSection />
    </div>
  );
}
