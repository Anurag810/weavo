import { findNode, getCatalogEntry } from "./schema-tree.js";
import { useBuilder } from "./BuilderProvider.jsx";

export function PropsPanel() {
  const { nodes, selectedId, updateProps, updateText } = useBuilder();

  const node = selectedId ? findNode(nodes, selectedId) : null;

  if (!node) {
    return (
      <aside className="weavo-pg-props">
        <h3 className="weavo-pg-panel-title">Properties</h3>
        <p className="weavo-pg-props-empty">Select a component to edit its properties.</p>
      </aside>
    );
  }

  const entry = getCatalogEntry(node.type);
  const fields = entry?.fields ?? [];

  return (
    <aside className="weavo-pg-props">
      <h3 className="weavo-pg-panel-title">Properties</h3>
      <div className="weavo-pg-props-type">{entry?.label ?? node.type}</div>

      <div className="weavo-pg-props-fields">
        {fields.map((field) => {
          const value = node.props?.[field.key] ?? "";

          return (
            <label key={field.key} className="weavo-pg-field">
              <span className="weavo-pg-field-label">{field.label}</span>
              {field.type === "select" ? (
                <select
                  className="weavo-pg-field-input"
                  value={value}
                  onChange={(e) => updateProps(node.id, { [field.key]: e.target.value })}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option === "" ? "(default)" : option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="weavo-pg-field-input"
                  type={field.type === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    updateProps(node.id, {
                      [field.key]:
                        field.type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                />
              )}
            </label>
          );
        })}

        {entry?.allowText && (
          <label className="weavo-pg-field">
            <span className="weavo-pg-field-label">Text content</span>
            <textarea
              className="weavo-pg-field-input weavo-pg-field-textarea"
              value={node.text ?? ""}
              rows={3}
              onChange={(e) => updateText(node.id, e.target.value)}
            />
          </label>
        )}
      </div>
    </aside>
  );
}

export default PropsPanel;
