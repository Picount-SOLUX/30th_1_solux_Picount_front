import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState("");

  const updateTheme = (key) => {
    setThemeKey(key);
    localStorage.setItem("calendarTheme", key);
  };

  return (
    <ThemeContext.Provider value={{ themeKey, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
