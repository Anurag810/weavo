import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { validateSchema } from "../schema-renderer/renderer.jsx";
import { BuilderProvider, useBuilder } from "./BuilderProvider.jsx";
import { ComponentPalette } from "./ComponentPalette.jsx";
import { BuilderCanvas } from "./BuilderCanvas.jsx";
import { PropsPanel } from "./PropsPanel.jsx";
import { PreviewPanel } from "./PreviewPanel.jsx";
import { JsonPanel } from "./JsonPanel.jsx";
import { DataSourcePanel } from "./DataSourcePanel.jsx";
import { PlaygroundToolbar } from "./PlaygroundToolbar.jsx";
import { ROOT_ID, getCatalogEntry, treeToSchema } from "./schema-tree.js";

function resolveTarget(overData) {
  if (!overData) return null;
  if (overData.source === "container") {
    return { containerId: overData.containerId, index: null };
  }
  if (overData.source === "node") {
    return { containerId: overData.parentId, index: overData.index };
  }
  return null;
}

function ValidationPanel({ result }) {
  const { errors, warnings } = result;

  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className="weavo-pg-validation is-ok">
        <span className="weavo-pg-validation-dot" /> Schema is valid
      </div>
    );
  }

  return (
    <div className="weavo-pg-validation">
      {errors.map((e, i) => (
        <div key={`err-${i}`} className="weavo-pg-validation-item is-error">
          <code>{e.path}</code> {e.message}
        </div>
      ))}
      {warnings.map((w, i) => (
        <div key={`warn-${i}`} className="weavo-pg-validation-item is-warning">
          <code>{w.path}</code> {w.message}
        </div>
      ))}
    </div>
  );
}

function PlaygroundInner() {
  const { nodes, addNode, moveNode, selectedId } = useBuilder();
  const [activeLabel, setActiveLabel] = useState(null);
  const [view, setView] = useState("preview");
  const prevSelected = useRef(null);

  useEffect(() => {
    if (selectedId && selectedId !== prevSelected.current) {
      setView("props");
    }
    prevSelected.current = selectedId;
  }, [selectedId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const schema = useMemo(() => treeToSchema(nodes), [nodes]);
  const validation = useMemo(() => validateSchema(schema), [schema]);

  const handleDragStart = (event) => {
    const data = event.active.data.current;
    if (data?.source === "palette") {
      setActiveLabel(getCatalogEntry(data.nodeType)?.label ?? data.nodeType);
    } else if (data?.source === "node") {
      setActiveLabel(getCatalogEntry(data.nodeType)?.label ?? data.nodeType ?? "Move");
    }
  };

  const handleDragEnd = (event) => {
    setActiveLabel(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const target = resolveTarget(over.data.current) ?? { containerId: ROOT_ID, index: null };

    if (activeData?.source === "palette") {
      addNode(activeData.nodeType, target.containerId, target.index);
      return;
    }

    if (activeData?.source === "node") {
      if (activeData.nodeId === over.id) return;
      moveNode(activeData.nodeId, target.containerId, target.index);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveLabel(null)}
    >
      <div className="weavo-pg">
        <PlaygroundToolbar schema={schema} />

        <div className="weavo-pg-body">
          <ComponentPalette />

          <div className="weavo-pg-center">
            <BuilderCanvas />
            <ValidationPanel result={validation} />
          </div>

          <div className="weavo-pg-right">
            <div className="weavo-pg-tabs">
              <button
                type="button"
                className={`weavo-pg-tab${view === "preview" ? " is-active" : ""}`}
                onClick={() => setView("preview")}
              >
                Preview
              </button>
              <button
                type="button"
                className={`weavo-pg-tab${view === "json" ? " is-active" : ""}`}
                onClick={() => setView("json")}
              >
                JSON
              </button>
              <button
                type="button"
                className={`weavo-pg-tab${view === "props" ? " is-active" : ""}`}
                onClick={() => setView("props")}
              >
                Properties
              </button>
              <button
                type="button"
                className={`weavo-pg-tab${view === "data" ? " is-active" : ""}`}
                onClick={() => setView("data")}
              >
                Data
              </button>
            </div>

            <div className="weavo-pg-right-body">
              {view === "preview" && <PreviewPanel schema={schema} />}
              {view === "json" && <JsonPanel schema={schema} />}
              {view === "props" && <PropsPanel />}
              {view === "data" && <DataSourcePanel />}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeLabel ? <div className="weavo-pg-drag-overlay">{activeLabel}</div> : null}
      </DragOverlay>
    </DndContext>
  );
}

export function PlaygroundPage() {
  return (
    <BuilderProvider>
      <PlaygroundInner />
    </BuilderProvider>
  );
}

export default PlaygroundPage;
