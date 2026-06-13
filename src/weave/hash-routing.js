/**
 * Parse schema id from URL hash: #/landing → "landing"
 */
export function getSchemaIdFromHash(weave) {
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
