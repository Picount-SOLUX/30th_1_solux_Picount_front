import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState("angel");

  useEffect(() => {
    const saved = localStorage.getItem("calendarTheme");
    if (saved) setThemeKey(saved);
  }, []);

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
