import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { applyTheme, initTheme } from "./apply-theme.js";
import { getAllThemes, isKnownTheme } from "./theme-registry.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ defaultTheme = "light", children }) {
  const [themeId, setThemeIdState] = useState(() => initTheme(defaultTheme));

  const setTheme = useCallback((nextThemeId, options = {}) => {
    if (!isKnownTheme(nextThemeId)) {
      console.warn(`[Weavo] Unknown theme: "${nextThemeId}"`);
      return false;
    }

    const { persist = true, customTokens = null } = options;
    applyTheme(nextThemeId, { persist, customTokens });
    setThemeIdState(nextThemeId);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      setTheme,
      themes: getAllThemes(),
      isDark: themeId === "dark",
    }),
    [themeId, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("[Weavo] useTheme must be used within a ThemeProvider");
  }

  return context;
}

export default ThemeContext;
