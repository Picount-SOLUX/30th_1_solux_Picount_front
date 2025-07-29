import { useState, useEffect } from "react";
import { SkinContext } from "./SkinContext";

export const SkinProvider = ({ children }) => {
  const [calendarSkinUrl, setCalendarSkinUrl] = useState({
    backgroundUrl: "",
    frameUrl: "",
  });

  useEffect(() => {
    setCalendarSkinUrl({
      frameUrl: "cal_chang_frame.png",
      frameSize: "contain", // 또는 "cover", "100% 90%" 등 스킨별 맞춤 가능
    });
  }, []);

  return (
    <SkinContext.Provider value={{ calendarSkinUrl, setCalendarSkinUrl }}>
      {children}
    </SkinContext.Provider>
  );
};
