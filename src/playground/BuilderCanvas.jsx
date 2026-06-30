import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ROOT_ID, getCatalogEntry, isContainerType } from "./schema-tree.js";
import { useBuilder } from "./BuilderProvider.jsx";

function nodeSummary(node) {
  if (node.props?.label) return node.props.label;
  if (node.props?.placeholder) return node.props.placeholder;
  if (typeof node.text === "string" && node.text) {
    return node.text.length > 32 ? `${node.text.slice(0, 32)}…` : node.text;
  }
  return null;
}

function ContainerArea({ containerId, nodes }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `container:${containerId}`,
    data: { source: "container", containerId },
  });

  return (
    <div
      ref={setNodeRef}
      className={`weavo-pg-dropzone${isOver ? " is-over" : ""}${nodes.length === 0 ? " is-empty" : ""}`}
    >
      <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
        {nodes.length === 0 ? (
          <span className="weavo-pg-dropzone-hint">Drop components here</span>
        ) : (
          nodes.map((node, index) => (
            <CanvasNode key={node.id} node={node} parentId={containerId} index={index} />
          ))
        )}
      </SortableContext>
    </div>
  );
}

function CanvasNode({ node, parentId, index }) {
  const { selectedId, select, deleteNode } = useBuilder();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
    data: { source: "node", nodeId: node.id, nodeType: node.type, parentId, index },
  });

  const entry = getCatalogEntry(node.type);
  const isContainer = isContainerType(node.type);
  const isSelected = selectedId === node.id;
  const summary = nodeSummary(node);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`weavo-pg-node${isSelected ? " is-selected" : ""}${isContainer ? " is-container" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        select(node.id);
      }}
    >
      <div className="weavo-pg-node-bar">
        <button
          type="button"
          className="weavo-pg-node-handle"
          aria-label="Drag"
          {...listeners}
          {...attributes}
        >
          ⠿
        </button>
        <span className="weavo-pg-node-type">{entry?.label ?? node.type}</span>
        {summary && <span className="weavo-pg-node-summary">{summary}</span>}
        <button
          type="button"
          className="weavo-pg-node-delete"
          aria-label="Delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteNode(node.id);
          }}
        >
          ×
        </button>
      </div>

      {isContainer && (
        <div className="weavo-pg-node-children">
          <ContainerArea containerId={node.id} nodes={node.children ?? []} />
        </div>
      )}
    </div>
  );
}

export function BuilderCanvas() {
  const { nodes, select } = useBuilder();

  return (
    <div className="weavo-pg-canvas" onClick={() => select(null)}>
      <ContainerArea containerId={ROOT_ID} nodes={nodes} />
    </div>
  );
}

export default BuilderCanvas;
