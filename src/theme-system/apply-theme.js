import { THEME_STORAGE_KEY, getTheme, isKnownTheme } from "./theme-registry.js";
import { THEME_TOKEN_KEYS, validateThemeTokens } from "./token-keys.js";

const CUSTOM_TOKEN_ATTR = "data-weavo-custom-theme";

/** @type {string[]} Keys applied via JS for custom JSON themes */
let appliedCustomKeys = [];

function getRoot() {
  return document.documentElement;
}

function clearCustomTokenOverrides() {
  const root = getRoot();
  for (const key of appliedCustomKeys) {
    root.style.removeProperty(key);
  }
  appliedCustomKeys = [];
  root.removeAttribute(CUSTOM_TOKEN_ATTR);
}

function applyCustomTokens(tokens = {}) {
  const { valid, invalid } = validateThemeTokens(tokens);
  if (!valid) {
    console.warn("[Weavo] Invalid theme token keys:", invalid);
  }

  const root = getRoot();
  clearCustomTokenOverrides();

  for (const [key, value] of Object.entries(tokens)) {
    if (!THEME_TOKEN_KEYS.includes(key)) continue;
    root.style.setProperty(key, value);
    appliedCustomKeys.push(key);
  }

  if (appliedCustomKeys.length > 0) {
    root.setAttribute(CUSTOM_TOKEN_ATTR, "true");
  }
}

export function getStoredThemeId(defaultTheme = "light") {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isKnownTheme(stored)) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return defaultTheme;
}

/**
 * Apply a theme by id. Built-in themes use data-theme; custom themes may inject token overrides.
 */
export function applyTheme(themeId, { persist = true, customTokens = null } = {}) {
  const theme = getTheme(themeId);

  if (!theme) {
    console.warn(`[Weavo] Unknown theme: "${themeId}"`);
    return false;
  }

  clearCustomTokenOverrides();

  const root = getRoot();
  root.setAttribute("data-theme", themeId);

  const tokens = customTokens ?? theme.tokens;
  if (tokens && Object.keys(tokens).length > 0) {
    applyCustomTokens(tokens);
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      /* ignore */
    }
  }

  return true;
}

export function initTheme(defaultTheme = "light") {
  const themeId = getStoredThemeId(defaultTheme);
  applyTheme(themeId, { persist: false });
  return themeId;
}
