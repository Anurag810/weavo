/**
 * Named handler registry for schema-driven events.
 * Reference handlers by name in schema listeners:
 *   "listeners": { "onClick": "callAI" }
 *   "listeners": { "onClick": { "handler": "alert", "message": "Hi" } }
 */
const listeners = {
  callAPI(event, payload = {}) {
    const api = payload.api || "get-weaves";
    fetch(`http://localhost:3000/api/weavo.${api}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("AI Response:", data);
      })
      .catch((error) => {
        console.error("Error fetching AI response:", error);
      });
  },

  // Backward-compatible alias used in search.schema.json
  onClick(event, payload, context) {
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

  /** Switch to another schema within the active Weave. */
  loadSchema(_event, payload = {}, context = {}) {
    const schemaId = payload.schema ?? payload.schemaId ?? payload.to;

    if (!schemaId) {
      console.warn("[Weavo] loadSchema requires schema, schemaId, or to");
      return;
    }

    if (typeof context.setActiveSchema === "function") {
      context.setActiveSchema(schemaId, { updateHash: payload.updateHash !== false });
      return;
    }

    window.location.hash = `#/${schemaId}`;
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

  openModal(_event, payload = {}, context = {}) {
    if (typeof context.showModal !== "function") {
      console.warn("[Weavo] openModal requires showModal in schema context");
      return;
    }

    context.showModal(payload.header, payload.body, payload.footer);
  },

  closeModal(_event, _payload = {}, context = {}) {
    if (typeof context.closeModal === "function") {
      context.closeModal();
    }
  },

  /** Switch global theme (light / dark / custom). */
  setTheme(_event, payload = {}, context = {}) {
    const themeId =
      payload.theme ?? payload.themeId ?? payload.to ?? payload.value ?? _event?.target?.value;

    if (!themeId) {
      console.warn("[Weavo] setTheme requires theme, themeId, or value");
      return;
    }

    if (typeof context.setTheme === "function") {
      context.setTheme(themeId);
      return;
    }

    console.warn("[Weavo] setTheme called outside ThemeProvider");
  },
};

export default listeners;
