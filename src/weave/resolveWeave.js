/**
 * Build a ResolvedWeave from a manifest and schema trees keyed by schema id.
 * Used when assembling a weave from API responses (manifest + per-schema fetches).
 *
 * @param {import('./types.js').WeaveManifest} manifest
 * @param {Record<string, object>} schemasById — schema id → JSON tree
 * @returns {import('./types.js').ResolvedWeave}
 */
export function resolveWeave(manifest, schemasById = {}) {
  if (!manifest?.schemas || typeof manifest.schemas !== "object") {
    throw new Error("[Weavo] Weave manifest must include a schemas object");
  }

  const schemas = {};

  for (const [id, entry] of Object.entries(manifest.schemas)) {
    const schema = schemasById[id];

    if (!schema) {
      throw new Error(`[Weavo] Schema "${id}" not provided for weave "${manifest.id}"`);
    }

    schemas[id] = {
      id,
      title: entry.title ?? id,
      file: entry.file,
      schema,
    };
  }

  const defaultId = manifest.default ?? Object.keys(schemas)[0];

  if (!schemas[defaultId]) {
    throw new Error(`[Weavo] Default schema "${defaultId}" not found in weave "${manifest.id}"`);
  }

  return {
    id: manifest.id,
    name: manifest.name ?? manifest.id,
    default: defaultId,
    schemas,
  };
}
