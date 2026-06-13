import listenerRegistry from "./listeners.js";

const EVENT_PROP_MAP = {
  click: "onClick",
  change: "onChange",
  submit: "onSubmit",
  focus: "onFocus",
  blur: "onBlur",
};

/**
 * Docs: 
 * bindListeners: Merge component props with schema listeners without clobbering
 * existing React event handlers (Tabs, Modal, Accordion, etc.).
 * 
 * handleListeners: Dispatch schema listeners for a DOM event.
 * 
 * resolveListener: Normalize a schema listener value into { handler, payload }.
 * 
 * runHandler: Run a single named handler from the registry.
 * 
 */



/**
 * Normalize a schema listener value into { handler, payload }.
 * Supports:
 *   "callAI"
 *   { "handler": "alert", "message": "Hi" }
 *   { "type": "navigate", "to": "/docs" }
 */
export function resolveListener(value) {
  if (typeof value === "string") {
    return { handler: value, payload: {} };
  }

  if (value && typeof value === "object") {
    const handler = value.handler || value.type;
    if (!handler) return null;

    const { handler: _h, type: _t, ...payload } = value;
    return { handler, payload };
  }

  return null;
}

/**
 * Run a single named handler from the registry.
 */
export function runHandler(handlerName, event, payload = {}, context = {}) {
  const fn = listenerRegistry[handlerName];

  if (typeof fn !== "function") {
    console.warn(`[Weavo] Unknown listener handler: "${handlerName}"`);
    return false;
  }

  fn(event, payload, context);
  return true;
}

/**
 * Dispatch schema listeners for a DOM event.
 */
export function handleListeners(listeners, event, context = {}) {
  if (!listeners || typeof listeners !== "object") return;
  const eventKey = EVENT_PROP_MAP[event.type] || event.type;
  const listenerValue = listeners[eventKey] ?? listeners[event.type];

  if (!listenerValue) return;

  const resolved = resolveListener(listenerValue);
  if (!resolved) {
    console.warn(`[Weavo] Invalid listener config for "${eventKey}"`, listenerValue);
    return;
  }

  runHandler(resolved.handler, event, resolved.payload, context);
}

/**
 * Merge component props with schema listeners without clobbering
 * existing React event handlers (Tabs, Modal, Accordion, etc.).
 */
export function bindListeners(componentProps = {}, listeners = {}, context = {}) {
  if (!listeners || Object.keys(listeners).length === 0) {
    return componentProps;
  }
  const bound = { ...componentProps };

  // Only wrap events declared in the schema — no need to scan every supported type.
  for (const [key, listenerValue] of Object.entries(listeners)) {
    if (listenerValue == null) continue;

    const reactProp = EVENT_PROP_MAP[key] ?? key;
    const existing = bound[reactProp];

    bound[reactProp] = (event) => {
      existing?.(event);
      handleListeners(listeners, event, context);
    };
  }

  return bound;
}

export default handleListeners;

