import { ComponentMap } from "../components";
import listenerRegistry from "../js/listeners.js";
import { resolveListener } from "../js/event-handlers.js";

const HTML_TAGS = new Set([
  "a", "article", "aside", "button", "code", "div", "em", "footer", "form",
  "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "img", "input", "label",
  "li", "main", "nav", "ol", "option", "p", "pre", "section", "select", "span",
  "strong", "sub", "sup", "table", "tbody", "td", "textarea", "th", "thead",
  "tr", "ul", "br", "small",
]);

const LISTENER_EVENTS = new Set(["onClick", "onChange", "onSubmit", "onFocus", "onBlur"]);

function pushError(errors, path, code, message) {
  errors.push({ path, code, message });
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isKnownType(type) {
  return type in ComponentMap || HTML_TAGS.has(type.toLowerCase());
}

function validateListeners(listeners, path, errors) {
  if (!isPlainObject(listeners)) {
    pushError(errors, path, "INVALID_LISTENERS", "listeners must be a plain object");
    return;
  }

  for (const [eventKey, listenerValue] of Object.entries(listeners)) {
    const listenerPath = `${path}.listeners.${eventKey}`;

    if (!LISTENER_EVENTS.has(eventKey)) {
      pushError(errors, listenerPath, "UNKNOWN_EVENT", `Unknown listener event "${eventKey}"`);
      continue;
    }

    const resolved = resolveListener(listenerValue);
    if (!resolved) {
      pushError(
        errors,
        listenerPath,
        "INVALID_LISTENER",
        "Listener must be a handler name string or { handler, ...payload }"
      );
      continue;
    }

    if (!(resolved.handler in listenerRegistry)) {
      pushError(errors, listenerPath, "UNKNOWN_HANDLER", `Unknown handler "${resolved.handler}"`);
    }
  }
}

function walkNode(node, path, errors, warnings) {
  if (typeof node === "string") {
    return;
  }

  if (node == null || typeof node !== "object") {
    pushError(errors, path, "INVALID_NODE", "Node must be a string or object");
    return;
  }

  if (Array.isArray(node)) {
    pushError(errors, path, "INVALID_NODE", "Expected a single node object, not an array");
    return;
  }

  const { type, props, styles, children, listeners: rootListeners } = node;

  if (!type || typeof type !== "string") {
    pushError(errors, `${path}.type`, "MISSING_TYPE", "Node must have a string type (component or HTML tag)");
    return;
  }

  if (!isKnownType(type)) {
    pushError(
      errors,
      `${path}.type`,
      "UNKNOWN_TYPE",
      `Unknown type "${type}". Use a registered component or supported HTML tag.`
    );
  }

  if (props !== undefined && !isPlainObject(props)) {
    pushError(errors, `${path}.props`, "INVALID_PROPS", "props must be a plain object");
  }

  if (styles !== undefined && !isPlainObject(styles)) {
    pushError(errors, `${path}.styles`, "INVALID_STYLES", "styles must be a plain object");
  }

  if (rootListeners !== undefined) {
    validateListeners(rootListeners, path, errors);
  }

  if (isPlainObject(props) && props.listeners !== undefined) {
    validateListeners(props.listeners, `${path}.props`, errors);
  }

  if (children === undefined || children === null) {
    return;
  }

  if (typeof children === "string") {
    return;
  }

  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      walkNode(child, `${path}.children[${index}]`, errors, warnings);
    });
    return;
  }

  if (isPlainObject(children)) {
    walkNode(children, `${path}.children`, errors, warnings);
    return;
  }

  pushError(
    errors,
    `${path}.children`,
    "INVALID_CHILDREN",
    "children must be a string, object, array, or omitted"
  );
}

/**
 * Validate a full schema tree.
 * @returns {{ valid: boolean, errors: Array, warnings: Array }}
 */
export function validateSchema(schema) {
  const errors = [];
  const warnings = [];

  if (schema == null || typeof schema !== "object" || Array.isArray(schema)) {
    pushError(errors, "$", "INVALID_SCHEMA", "Schema must be a root object node");
    return { valid: false, errors, warnings };
  }

  walkNode(schema, "$", errors, warnings);

  if (schema.type && schema.type !== "Page") {
    warnings.push({
      path: "$.type",
      code: "ROOT_NOT_PAGE",
      message: 'Root node is usually type "Page"',
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate a single node subtree.
 * @returns {{ valid: boolean, errors: Array, warnings: Array }}
 */
export function validateNode(node, path = "$") {
  const errors = [];
  const warnings = [];
  walkNode(node, path, errors, warnings);
  return { valid: errors.length === 0, errors, warnings };
}
