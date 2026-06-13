export const THEME_STORAGE_KEY = "weavo.theme";

export const BUILTIN_THEMES = {
  light: {
    id: "light",
    name: "Light",
    type: "builtin",
  },
  dark: {
    id: "dark",
    name: "Dark",
    type: "builtin",
  },
};

/** @type {Map<string, object>} Custom JSON themes (Phase 2) */
const customThemes = new Map();

export function getBuiltinThemes() {
  return Object.values(BUILTIN_THEMES);
}

export function getTheme(themeId) {
  if (BUILTIN_THEMES[themeId]) {
    return BUILTIN_THEMES[themeId];
  }
  return customThemes.get(themeId) ?? null;
}

export function isKnownTheme(themeId) {
  return Boolean(getTheme(themeId));
}

/**
 * Register a JSON custom theme (Phase 2 stub).
 * @param {object} theme - { id, name, extends?, tokens? }
 */
export function registerTheme(theme) {
  if (!theme?.id) {
    throw new Error("[Weavo] Theme must have an id");
  }
  customThemes.set(theme.id, { ...theme, type: "custom" });
  return theme.id;
}

export function getAllThemes() {
  return [...getBuiltinThemes(), ...customThemes.values()];
}
