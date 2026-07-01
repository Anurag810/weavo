import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Directory containing weave manifests and schema JSON files. */
export const SCHEMAS_DIR = path.join(__dirname, "../builder/mock-schemas");

/** Weave manifest filenames to load at startup. */
const MANIFEST_FILES = ["app.weave.json"];

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

let cachedWeaves = null;

async function readJson(relativePath) {
  const filePath = path.join(SCHEMAS_DIR, relativePath);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJson(relativePath, data) {
  const filePath = path.join(SCHEMAS_DIR, relativePath);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

/** Find the manifest filename whose `id` matches the given weave id. */
async function getManifestFile(weaveId) {
  for (const file of MANIFEST_FILES) {
    const manifest = await readJson(file);
    if (manifest.id === weaveId) {
      return { file, manifest };
    }
  }
  return null;
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

/** Minimal structural check (the rich validator lives client-side with JSX). */
function isValidSchemaShape(schema) {
  return schema !== null && typeof schema === "object" && !Array.isArray(schema) && typeof schema.type === "string";
}

/**
 * Create or overwrite a schema in a weave: write `{schemaId}.schema.json`
 * and register it in the weave manifest. Returns the saved entry.
 */
export async function saveSchema(weaveId, { schemaId, title, schema }) {
  if (!SLUG_PATTERN.test(schemaId ?? "")) {
    throw new Error("schemaId must be lowercase letters, numbers, and dashes");
  }

  if (!isValidSchemaShape(schema)) {
    throw new Error("schema must be an object with a string type");
  }

  const found = await getManifestFile(weaveId);
  if (!found) {
    throw new Error(`Weave "${weaveId}" not found`);
  }

  const { file: manifestFile, manifest } = found;
  const schemaFile = `${schemaId}.schema.json`;

  await writeJson(schemaFile, schema);

  manifest.schemas = manifest.schemas ?? {};
  manifest.schemas[schemaId] = {
    title: title || schemaId,
    file: schemaFile,
  };

  await writeJson(manifestFile, manifest);

  // Invalidate cache so subsequent fetches pick up the new schema.
  cachedWeaves = null;

  return { schemaId, title: manifest.schemas[schemaId].title, file: schemaFile };
}
