import landingSchema from "../builder/mock-schemas/landing.schema.json";
import componentsSchema from "../builder/mock-schemas/components.schema.json";
import searchSchema from "../builder/mock-schemas/search.schema.json";

/**
 * Maps schema filenames to their imported JSON trees.
 * Add new entries here when registering schemas in a Weave manifest.
 */
export const schemaRegistry = {
  "landing.schema.json": landingSchema,
  "components.schema.json": componentsSchema,
  "search.schema.json": searchSchema,
};
