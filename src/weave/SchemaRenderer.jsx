import { Fragment, useMemo } from "react";
import { renderNode, validateSchema } from "../schema-renderer/renderer.jsx";
import { Modal } from "../components/ui";
import { useWeave } from "./WeaveProvider.jsx";
import { useTheme } from "../theme-system/ThemeProvider.jsx";

function renderModalFooter(footer, context) {
  if (footer == null) return null;

  if (Array.isArray(footer)) {
    return footer.map((node, index) => (
      <Fragment key={`modal-footer-${index}`}>{renderNode(node, `modal-footer-${index}`, context)}</Fragment>
    ));
  }

  if (typeof footer === "string") {
    return footer;
  }

  return renderNode(footer, "modal-footer", context);
}

/**
 * Renders the active schema from the current Weave context.
 */
export function SchemaRenderer() {
  const { activeSchema, activeSchemaId, setActiveSchema, showModal, closeModal, modal, weave } = useWeave();
  const { themeId, setTheme } = useTheme();

  const context = useMemo(
    () => ({
      weaveId: weave.id,
      schemaId: activeSchemaId,
      setActiveSchema,
      showModal,
      closeModal,
      schemas: weave.schemas,
      themeId,
      setTheme,
    }),
    [weave.id, activeSchemaId, setActiveSchema, showModal, closeModal, weave.schemas, themeId, setTheme]
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
          <Modal.Header>{modal.header}</Modal.Header>
          <Modal.Body>{modal.body}</Modal.Body>
          <Modal.Footer>{renderModalFooter(modal.footer, context)}</Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default SchemaRenderer;
