import { useEffect, useState } from "react";

const THEME_KEY = "prayer-theme";

export const useTheme = () => {
  const [dark, setDark] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_KEY);
      const isDark = stored === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  // Update on toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((prev) => !prev) };
};
