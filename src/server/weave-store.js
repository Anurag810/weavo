import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Directory containing weave manifests and schema JSON files. */
export const SCHEMAS_DIR = path.join(__dirname, "../builder/mock-schemas");

/** Weave manifest filenames to load at startup. */
const MANIFEST_FILES = ["app.weave.json"];

let cachedWeaves = null;

async function readJson(relativePath) {
  const filePath = path.join(SCHEMAS_DIR, relativePath);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function loadManifests() {
  if (cachedWeaves) {
    return cachedWeaves;
  }

  cachedWeaves = await Promise.all(MANIFEST_FILES.map((file) => readJson(file)));
  return cachedWeaves;
}

export async function getAllWeaves() {
  return loadManifests();
}

export async function getWeaveById(weaveId) {
  const weaves = await loadManifests();
  return weaves.find((weave) => weave.id === weaveId) ?? null;
}

export async function getSchemaByFilename(filename) {
  return readJson(filename);
}

/**
 * Load manifest + all schema trees for a weave (API-ready resolved shape).
 */
export async function getResolvedWeave(weaveId) {
  const manifest = await getWeaveById(weaveId);

  if (!manifest) {
    return null;
  }

  const schemas = {};

  for (const [id, entry] of Object.entries(manifest.schemas)) {
    schemas[id] = {
      id,
      title: entry.title ?? id,
      file: entry.file,
      schema: await getSchemaByFilename(entry.file),
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
