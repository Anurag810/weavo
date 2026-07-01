import { useDraggable } from "@dnd-kit/core";
import { CATALOG } from "./schema-tree.js";

function PaletteItem({ entry }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${entry.type}`,
    data: { source: "palette", nodeType: entry.type },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`weavo-pg-palette-item${isDragging ? " is-dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <span className="weavo-pg-palette-item-type">{entry.label}</span>
      {entry.isContainer && <span className="weavo-pg-palette-tag">container</span>}
    </button>
  );
}

export function ComponentPalette() {
  // Sub-parts (e.g. Card.Header, Tabs.Tab) are marked `hidden` — they are
  // created automatically via compound presets, so we keep the palette clean.
  const groups = CATALOG.filter((entry) => !entry.hidden).reduce((acc, entry) => {
    (acc[entry.group] ??= []).push(entry);
    return acc;
  }, {});

  return (
    <aside className="weavo-pg-palette">
      <h3 className="weavo-pg-panel-title">Components</h3>
      <p className="weavo-pg-palette-hint">Drag onto the canvas</p>

      {Object.entries(groups).map(([group, entries]) => (
        <div key={group} className="weavo-pg-palette-group">
          <span className="weavo-pg-palette-group-label">{group}</span>
          <div className="weavo-pg-palette-items">
            {entries.map((entry) => (
              <PaletteItem key={entry.type} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

export default ComponentPalette;
