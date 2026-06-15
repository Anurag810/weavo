const API_BASE = import.meta.env.VITE_API_URL ?? "";

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

/**
 * Fetch a fully resolved weave (manifest + all schema trees) from the API.
 * @param {string} weaveId
 * @returns {Promise<import('./types.js').ResolvedWeave>}
 */
export async function fetchWeave(weaveId) {
  const response = await fetch(apiUrl(`/api/weavo.weave/${encodeURIComponent(weaveId)}/resolved`));

  if (!response.ok) {
    throw new Error(`Failed to load weave "${weaveId}" (${response.status})`);
  }

  const body = await response.json();
  return body.data;
}

/**
 * Fetch weave manifest only (no schema trees).
 */
export async function fetchWeaveManifest(weaveId) {
  const response = await fetch(apiUrl(`/api/weavo.weave/${encodeURIComponent(weaveId)}`));

  if (!response.ok) {
    throw new Error(`Failed to load weave manifest "${weaveId}" (${response.status})`);
  }

  const body = await response.json();
  return body.data;
}

/**
 * Fetch a single schema tree from the API.
 */
export async function fetchSchema(weaveId, schemaId) {
  const response = await fetch(
    apiUrl(`/api/weavo.weave/${encodeURIComponent(weaveId)}/schema/${encodeURIComponent(schemaId)}`)
  );

  if (!response.ok) {
    throw new Error(`Failed to load schema "${schemaId}" (${response.status})`);
  }

  const body = await response.json();
  return body.data;
}
