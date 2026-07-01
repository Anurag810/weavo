import { useEffect, useState } from "react";
import { useBuilder } from "./BuilderProvider.jsx";

/**
 * Read-only-by-default JSON view of the current schema. Editing the JSON and
 * clicking Apply re-loads the builder tree (README v0.5 code-editor lite).
 */
export function JsonPanel({ schema }) {
  const { load } = useBuilder();
  const formatted = JSON.stringify(schema, null, 2);

  const [draft, setDraft] = useState(formatted);
  const [error, setError] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) {
      setDraft(formatted);
    }
  }, [formatted, dirty]);

  const apply = () => {
    try {
      const parsed = JSON.parse(draft);
      load(parsed);
      setError(null);
      setDirty(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="weavo-pg-json">
      <div className="weavo-pg-json-toolbar">
        <h3 className="weavo-pg-panel-title">Schema JSON</h3>
        <div className="weavo-pg-json-actions">
          <button
            type="button"
            className="weavo-btn weavo-btn-default sm"
            onClick={() => {
              setDraft(formatted);
              setDirty(false);
              setError(null);
            }}
          >
            Reset
          </button>
          <button type="button" className="weavo-btn weavo-btn-primary sm" onClick={apply}>
            Apply to canvas
          </button>
        </div>
      </div>

      <textarea
        className="weavo-pg-json-editor"
        spellCheck={false}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setDirty(true);
        }}
      />

      {error && <div className="weavo-pg-json-error">Invalid JSON: {error}</div>}
    </section>
  );
}

export default JsonPanel;
