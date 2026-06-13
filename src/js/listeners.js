/**
 * Named handler registry for schema-driven events.
 * Reference handlers by name in schema listeners:
 *   "listeners": { "onClick": "callAI" }
 *   "listeners": { "onClick": { "handler": "alert", "message": "Hi" } }
 */
const listeners = {
  callAI(event, payload = {}) {
    const message = payload.message || "Hello, WeavoAI!";
    fetch(`http://localhost:3000/api/ai?message=${encodeURIComponent(message)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("AI Response:", data);
      })
      .catch((error) => {
        console.error("Error fetching AI response:", error);
      });
  },

  // Backward-compatible alias used in demo.schema-search.json
  onClick(event, payload, context) {
    // listeners.callAI(event, payload, context);
    console.log("onClick", event, payload, context);
  },

  alert(_event, payload = {}) {
    if (payload.message) window.alert(payload.message);
  },

  log(_event, payload = {}) {
    console.log(payload.message ?? "Weavo event", payload);
  },

  navigate(_event, payload = {}) {
    if (!payload.to) return;
    if (payload.replace) {
      window.location.replace(payload.to);
    } else {
      window.location.href = payload.to;
    }
  },

  external(_event, payload = {}) {
    if (!payload.url) return;
    window.open(payload.url, payload.target || "_blank", "noopener,noreferrer");
  },

  scrollTo(_event, payload = {}) {
    const target = payload.to || payload.selector;
    if (!target) return;
    document.querySelector(target)?.scrollIntoView({
      behavior: payload.behavior || "smooth",
      block: payload.block || "start",
    });
  },

  setState(_event, payload = {}) {
    console.log("setState", payload.key, payload.value);
  },
};

export default listeners;
