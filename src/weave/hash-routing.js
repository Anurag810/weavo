/** Reserved virtual route for the drag-and-drop builder. */
export const PLAYGROUND_ROUTE = "playground";

/**
 * True when the current hash targets the playground tool (#/playground).
 * The playground is a React tool, not a weave schema page.
 */
export function isPlaygroundRoute() {
  const match = window.location.hash.match(/^#\/([^/?#]+)/);
  return match?.[1] === PLAYGROUND_ROUTE;
}

/**
 * Parse schema id from URL hash: #/landing → "landing"
 */
export function getSchemaIdFromHash(weave) {
  if (!weave?.schemas) {
    return null;
  }

  const match = window.location.hash.match(/^#\/([^/?#]+)/);
  const id = match?.[1];

  if (id && weave.schemas[id]) {
    return id;
  }

  return null;
}

/**
 * Update URL hash without triggering navigation.
 */
export function setSchemaHash(schemaId) {
  const next = `#/${schemaId}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, "", next);
  }
}
