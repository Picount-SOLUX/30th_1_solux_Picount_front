import { calendarThemes } from "../../constants/ThemeList";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeShop() {
  const { themeKey, updateTheme } = useTheme();

  return (
    <div>
      <h2>📦 테마 상점</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {calendarThemes.map((theme) => (
          <div key={theme.id} style={{ textAlign: "center" }}>
            <img
              src={theme.backgroundImage}
              alt={theme.name}
              width="120"
              style={{
                border:
                  theme.themeKey === themeKey
                    ? "3px solid #007bff"
                    : "1px solid gray",
                borderRadius: "8px",
              }}
            />
            <p>{theme.name}</p>
            <button onClick={() => updateTheme(theme.themeKey)}>
              {theme.themeKey === themeKey ? "✅ 적용 중" : "적용하기"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
