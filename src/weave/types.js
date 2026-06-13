/**
 * @typedef {Object} WeaveSchemaEntry
 * @property {string} title
 * @property {string} file
 */

/**
 * @typedef {Object} WeaveManifest
 * @property {string} id
 * @property {string} [name]
 * @property {string} [default]
 * @property {Record<string, WeaveSchemaEntry>} schemas
 */

/**
 * @typedef {Object} ResolvedSchema
 * @property {string} id
 * @property {string} title
 * @property {string} file
 * @property {Object} schema
 */

/**
 * @typedef {Object} ResolvedWeave
 * @property {string} id
 * @property {string} name
 * @property {string} default
 * @property {Record<string, ResolvedSchema>} schemas
 */

/**
 * @typedef {Object} WeaveContextValue
 * @property {import('./types.js').ResolvedWeave} weave
 * @property {string} activeSchemaId
 * @property {import('./types.js').ResolvedSchema} activeSchema
 * @property {(schemaId: string) => void} setActiveSchema
 * @property {string[]} schemaIds
 */

export {};
