import { useMemo } from "react";
import { renderNode, validateSchema } from "../schema-renderer/renderer.jsx";
import { Modal } from "../components/ui";
import { useWeave } from "./WeaveProvider.jsx";
import { useTheme } from "../theme-system/ThemeProvider.jsx";

/**
 * Renders the active schema from the current Weave context.
 */
export function SchemaRenderer() {
  const {
    activeSchema,
    activeSchemaId,
    setActiveSchema,
    showModal,
    closeModal,
    modal,
    weave,
    login,
    logout,
    isLoggedIn,
    userDetails,
  } = useWeave();
  const { themeId, setTheme } = useTheme();

  const context = useMemo(
    () => ({
      weaveId: weave.id,
      schemaId: activeSchemaId,
      setActiveSchema,
      showModal,
      closeModal,
      login,
      logout,
      isLoggedIn,
      userDetails,
      schemas: weave.schemas,
      themeId,
      setTheme,
    }),
    [
      weave.id,
      activeSchemaId,
      setActiveSchema,
      showModal,
      closeModal,
      login,
      logout,
      isLoggedIn,
      userDetails,
      weave.schemas,
      themeId,
      setTheme,
    ]
  );

  if (!activeSchema?.schema) {
    return null;
  }

  const { valid, errors } = validateSchema(activeSchema.schema);
  if (!valid) {
    console.warn("[Weavo] Invalid schema:", errors);
    return null;
  }

  return (
    <>
      {renderNode(activeSchema.schema, activeSchemaId, context)}
      {modal && (
        <Modal defaultOpen onClose={closeModal} size="md" speed="normal">
          <Modal.Header onClose={closeModal}>{modal.header}</Modal.Header>
          <Modal.Body>{renderNode(modal.body, "modal-body", context)}</Modal.Body>
          <Modal.Footer>{renderNode(modal.footer, "modal-footer", context)}</Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default SchemaRenderer;
