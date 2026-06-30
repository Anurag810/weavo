import { useState } from "react";
import { validateSchema } from "../schema-renderer/renderer.jsx";
import { saveSchema } from "../weave/fetchWeave.js";
import { useWeave } from "../weave/WeaveProvider.jsx";
import { useBuilder } from "./BuilderProvider.jsx";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export function PlaygroundToolbar({ schema }) {
  const { weave } = useWeave();
  const { load, clear, nodes } = useBuilder();

  const [schemaId, setSchemaId] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const existingSchemas = Object.entries(weave.schemas ?? {});

  const loadExisting = (id) => {
    if (!id) return;
    const entry = weave.schemas[id];
    if (entry?.schema) {
      load(entry.schema);
      setSchemaId(id);
      setTitle(entry.title ?? id);
      setStatus({ kind: "info", message: `Loaded "${id}" for editing.` });
    }
  };

  const handleSave = async () => {
    const id = schemaId.trim().toLowerCase();

    if (!SLUG_PATTERN.test(id)) {
      setStatus({ kind: "error", message: "Schema id must be lowercase letters, numbers, and dashes." });
      return;
    }

    if (nodes.length === 0) {
      setStatus({ kind: "error", message: "Add at least one component before saving." });
      return;
    }

    const { valid, errors } = validateSchema(schema);
    if (!valid) {
      setStatus({ kind: "error", message: `Schema is invalid: ${errors[0]?.message ?? "unknown error"}` });
      return;
    }

    setSaving(true);
    setStatus({ kind: "info", message: "Saving…" });

    try {
      const result = await saveSchema(weave.id, { schemaId: id, title: title.trim() || id, schema });
      setStatus({
        kind: "success",
        message: `Saved ${result.file}. Open #/${id} to view it (reload to refresh the weave).`,
      });
    } catch (err) {
      setStatus({ kind: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="weavo-pg-toolbar">
      <div className="weavo-pg-toolbar-group">
        <span className="weavo-pg-brand">Weavo Playground</span>
      </div>

      <div className="weavo-pg-toolbar-group">
        <select
          className="weavo-pg-field-input"
          defaultValue=""
          onChange={(e) => loadExisting(e.target.value)}
          aria-label="Load existing schema"
        >
          <option value="">Load schema…</option>
          {existingSchemas.map(([id, entry]) => (
            <option key={id} value={id}>
              {entry.title ?? id}
            </option>
          ))}
        </select>

        <input
          className="weavo-pg-field-input"
          placeholder="schema-id"
          value={schemaId}
          onChange={(e) => setSchemaId(e.target.value)}
        />
        <input
          className="weavo-pg-field-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="weavo-pg-toolbar-group weavo-pg-toolbar-actions">
        <button type="button" className="weavo-btn weavo-btn-default sm" onClick={clear}>
          Clear
        </button>
        <button
          type="button"
          className="weavo-btn weavo-btn-primary sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {status && (
        <div className={`weavo-pg-status weavo-pg-status-${status.kind}`}>{status.message}</div>
      )}
    </div>
  );
}

export default PlaygroundToolbar;
