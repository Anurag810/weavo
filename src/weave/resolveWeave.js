import { schemaRegistry } from "./schema-registry.js";

/**
 * Resolve a Weave manifest by linking schema entries to imported JSON.
 * @param {import('./types.js').WeaveManifest} manifest
 * @returns {import('./types.js').ResolvedWeave}
 */
export function resolveWeave(manifest) {
  if (!manifest?.schemas || typeof manifest.schemas !== "object") {
    throw new Error("[Weavo] Weave manifest must include a schemas object");
  }

  const schemas = {};

  for (const [id, entry] of Object.entries(manifest.schemas)) {
    const schema = schemaRegistry[entry.file];

    if (!schema) {
      throw new Error(`[Weavo] Schema file not registered: "${entry.file}" (weave: ${manifest.id})`);
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
