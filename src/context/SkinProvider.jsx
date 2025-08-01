import { useState, useEffect } from "react";
import { SkinContext } from "./SkinContext";

export const SkinProvider = ({ children }) => {
  const [calendarSkinUrl, setCalendarSkinUrl] = useState({
    backgroundUrl: "",
    frameUrl: "",
  });

  return (
    <SkinContext.Provider value={{ calendarSkinUrl, setCalendarSkinUrl }}>
      {children}
    </SkinContext.Provider>
  );
};
