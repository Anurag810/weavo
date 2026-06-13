import { useMemo } from "react";
import { renderNode } from "../schema-renderer/renderer.jsx";
import { useWeave } from "./WeaveProvider.jsx";
import { useTheme } from "../theme-system/ThemeProvider.jsx";

/**
 * Renders the active schema from the current Weave context.
 */
export function SchemaRenderer() {
  const { activeSchema, activeSchemaId, setActiveSchema, weave } = useWeave();
  const { themeId, setTheme } = useTheme();

  const context = useMemo(
    () => ({
      weaveId: weave.id,
      schemaId: activeSchemaId,
      setActiveSchema,
      schemas: weave.schemas,
      themeId,
      setTheme,
    }),
    [weave.id, activeSchemaId, setActiveSchema, weave.schemas, themeId, setTheme]
  );

  if (!activeSchema?.schema) {
    return null;
  }

  return renderNode(activeSchema.schema, activeSchemaId, context);
}

export default SchemaRenderer;
