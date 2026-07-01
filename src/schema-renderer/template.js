/**
 * Lightweight {{ path }} template resolution for schema values.
 *
 * Bindings reference a scope object, e.g. with scope = { data: <response> }:
 *   "{{ data.message }}"      -> scope.data.message
 *   "{{ data.data.0.name }}"  -> scope.data.data[0].name
 *   "Hello {{ data.user }}!"  -> string interpolation
 *
 * A whole-string single expression returns the raw resolved value (keeping its
 * type), so "{{ data.items }}" can yield an array/object, not "[object Object]".
 */

const TEMPLATE_RE = /\{\{\s*([^}]+?)\s*\}\}/g;
const WHOLE_RE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

export function hasTemplate(value) {
  return typeof value === "string" && value.includes("{{") && /\{\{[^}]+\}\}/.test(value);
}

/** Resolve a dotted/bracketed path against an object. */
export function getPath(obj, path) {
  const keys = path.split(/[.[\]]+/).filter(Boolean);
  let current = obj;

  for (const key of keys) {
    if (current == null) return undefined;
    current = current[key];
  }

  return current;
}

/** Resolve a single string value containing {{ }} expressions. */
export function resolveTemplate(value, scope) {
  if (typeof value !== "string" || !hasTemplate(value)) return value;

  const whole = value.match(WHOLE_RE);
  if (whole) {
    const resolved = getPath(scope, whole[1].trim());
    return resolved === undefined ? "" : resolved;
  }

  return value.replace(TEMPLATE_RE, (_match, expr) => {
    const resolved = getPath(scope, expr.trim());
    if (resolved === undefined || resolved === null) return "";
    return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
  });
}

/** Recursively resolve templates in strings/arrays/objects (e.g. a props bag). */
export function resolveDeep(value, scope) {
  if (typeof value === "string") return resolveTemplate(value, scope);
  if (Array.isArray(value)) return value.map((item) => resolveDeep(item, scope));
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = resolveDeep(value[key], scope);
    }
    return out;
  }
  return value;
}

/**
 * Build a binding scope from the render context, or null when there is nothing
 * to bind (so normal pages skip template work entirely).
 */
export function getScope(context) {
  if (!context) return null;
  if (context.data !== undefined || context.scope) {
    return { data: context.data, ...(context.scope ?? {}) };
  }
  return null;
}
