/**
 * CSS custom properties that JSON custom themes may override (Phase 2).
 * Used for validation when registering user themes.
 */
export const THEME_TOKEN_KEYS = [
  "--color-primary",
  "--color-primary-hover",
  "--color-primary-active",
  "--color-primary-subtle",
  "--color-primary-focus",
  "--color-success",
  "--color-success-hover",
  "--color-success-subtle",
  "--color-success-focus",
  "--color-warning",
  "--color-warning-hover",
  "--color-warning-subtle",
  "--color-warning-focus",
  "--color-danger",
  "--color-danger-hover",
  "--color-danger-subtle",
  "--color-danger-focus",
  "--color-info",
  "--color-info-hover",
  "--color-info-subtle",
  "--color-info-focus",
  "--color-secondary",
  "--color-secondary-hover",
  "--color-secondary-text",
  "--color-bg",
  "--color-bg-elevated",
  "--color-bg-hover",
  "--color-bg-muted",
  "--color-bg-active",
  "--color-text",
  "--color-text-secondary",
  "--color-text-muted",
  "--color-text-inverse",
  "--color-accent",
  "--border-light",
  "--border-medium",
  "--modal-overlay-bg",
  "--tooltip-bg",
];

export function validateThemeTokens(tokens = {}) {
  const invalid = Object.keys(tokens).filter((key) => !THEME_TOKEN_KEYS.includes(key));
  return { valid: invalid.length === 0, invalid };
}
