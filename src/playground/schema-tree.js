/**
 * Playground schema-tree utilities.
 *
 * The builder keeps an internal tree of nodes shaped as:
 *   { id, type, props, text, children }
 *
 * `id` is builder-internal and stripped when exporting to a Weavo schema.
 * Containers use `children`; leaf/text nodes use `text` for string content.
 */

export const ROOT_ID = "root";

let counter = 0;

function nextId() {
  counter += 1;
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `n_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `n_${Date.now().toString(36)}_${counter}`;
}

/**
 * Component catalog used by the palette and props panel.
 * `fields` drives the editable inputs in PropsPanel.
 */
export const CATALOG = [
  // ---- Layout ----
  {
    type: "Section",
    label: "Section",
    group: "Layout",
    isContainer: true,
    defaultProps: { direction: "column" },
    fields: [
      { key: "direction", label: "Direction", type: "select", options: ["column", "row"] },
      { key: "className", label: "Class name", type: "text" },
    ],
  },
  {
    type: "Container",
    label: "Container",
    group: "Layout",
    isContainer: true,
    defaultProps: { direction: "row" },
    fields: [
      { key: "direction", label: "Direction", type: "select", options: ["row", "column"] },
      { key: "className", label: "Class name", type: "text" },
    ],
  },
  {
    type: "Header",
    label: "Header",
    group: "Layout",
    isContainer: true,
    allowText: true,
    defaultText: "Header",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "Footer",
    label: "Footer",
    group: "Layout",
    isContainer: true,
    allowText: true,
    defaultText: "Footer",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "Card",
    label: "Card",
    group: "Layout",
    isContainer: true,
    fields: [{ key: "className", label: "Class name", type: "text" }],
    preset: [
      { type: "Card.Header", text: "Card title" },
      { type: "Card.Body", text: "Card body content." },
      {
        type: "Card.Footer",
        children: [{ type: "Button", props: { label: "Action", variant: "primary" } }],
      },
    ],
  },
  {
    type: "Card.Header",
    label: "Card · Header",
    group: "Card",
    hidden: true,
    isContainer: true,
    allowText: true,
    defaultText: "Card title",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "Card.Body",
    label: "Card · Body",
    group: "Card",
    hidden: true,
    isContainer: true,
    allowText: true,
    defaultText: "Card body content.",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "Card.Footer",
    label: "Card · Footer",
    group: "Card",
    hidden: true,
    isContainer: true,
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },

  // ---- UI ----
  {
    type: "Button",
    label: "Button",
    group: "UI",
    defaultProps: { label: "Button", variant: "primary" },
    fields: [
      { key: "label", label: "Label", type: "text" },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["primary", "secondary", "default", "success", "danger"],
      },
      { key: "size", label: "Size", type: "select", options: ["", "sm", "lg"] },
    ],
  },
  {
    type: "Input",
    label: "Input",
    group: "UI",
    defaultProps: { placeholder: "Enter text" },
    fields: [
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["text", "password", "email", "number"] },
    ],
  },
  {
    type: "Badge",
    label: "Badge",
    group: "UI",
    allowText: true,
    defaultText: "Badge",
    defaultProps: { variant: "primary" },
    fields: [
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["primary", "success", "warning", "danger", "info"],
      },
    ],
  },
  {
    type: "Spinner",
    label: "Spinner",
    group: "UI",
    defaultProps: { className: "weavo-spinner md primary" },
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "ProgressBar",
    label: "Progress Bar",
    group: "UI",
    defaultProps: { value: 60, size: "md", variant: "primary", speed: "slow" },
    fields: [
      { key: "value", label: "Value", type: "number" },
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"] },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["primary", "success", "warning", "danger", "info"],
      },
      { key: "speed", label: "Speed", type: "select", options: ["slow", "fast"] },
    ],
  },

  // ---- Tabs ----
  {
    type: "Tabs",
    label: "Tabs",
    group: "Tabs",
    isContainer: true,
    fields: [],
    preset: [
      {
        type: "Tabs.TabList",
        children: [
          { type: "Tabs.Tab", text: "Tab 1" },
          { type: "Tabs.Tab", text: "Tab 2" },
        ],
      },
      { type: "Tabs.TabPanel", text: "Content for tab 1." },
      { type: "Tabs.TabPanel", text: "Content for tab 2." },
    ],
  },
  {
    type: "Tabs.TabList",
    label: "Tabs · TabList",
    group: "Tabs",
    hidden: true,
    isContainer: true,
    fields: [],
  },
  {
    type: "Tabs.Tab",
    label: "Tabs · Tab",
    group: "Tabs",
    hidden: true,
    allowText: true,
    defaultText: "Tab",
    fields: [],
  },
  {
    type: "Tabs.TabPanel",
    label: "Tabs · Panel",
    group: "Tabs",
    hidden: true,
    isContainer: true,
    allowText: true,
    defaultText: "Tab panel content.",
    fields: [],
  },

  // ---- Accordion ----
  {
    type: "Accordion",
    label: "Accordion",
    group: "Accordion",
    isContainer: true,
    defaultProps: { allowMultiple: true },
    fields: [],
    preset: [{ type: "Accordion.Item" }, { type: "Accordion.Item" }],
  },
  {
    type: "Accordion.Item",
    label: "Accordion · Item",
    group: "Accordion",
    hidden: true,
    isContainer: true,
    fields: [],
    preset: [
      { type: "Accordion.Header", text: "Section title" },
      { type: "Accordion.Panel", text: "Panel content." },
    ],
  },
  {
    type: "Accordion.Header",
    label: "Accordion · Header",
    group: "Accordion",
    hidden: true,
    allowText: true,
    defaultText: "Section title",
    fields: [],
  },
  {
    type: "Accordion.Panel",
    label: "Accordion · Panel",
    group: "Accordion",
    hidden: true,
    isContainer: true,
    allowText: true,
    defaultText: "Panel content.",
    fields: [],
  },

  // ---- Text ----
  {
    type: "h1",
    label: "Heading 1",
    group: "Text",
    allowText: true,
    defaultText: "Heading",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "h2",
    label: "Heading 2",
    group: "Text",
    allowText: true,
    defaultText: "Subheading",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
  {
    type: "p",
    label: "Paragraph",
    group: "Text",
    allowText: true,
    defaultText: "Some descriptive text.",
    fields: [{ key: "className", label: "Class name", type: "text" }],
  },
];

const CATALOG_BY_TYPE = Object.fromEntries(CATALOG.map((entry) => [entry.type, entry]));

export function getCatalogEntry(type) {
  return CATALOG_BY_TYPE[type] ?? null;
}

export function isContainerType(type) {
  return Boolean(CATALOG_BY_TYPE[type]?.isContainer);
}

/**
 * Create a fresh builder node for a catalog type.
 */
export function createNode(type) {
  const entry = getCatalogEntry(type);
  const node = {
    id: nextId(),
    type,
    props: entry?.defaultProps ? { ...entry.defaultProps } : {},
  };

  if (entry?.isContainer) {
    node.children = [];
  }
  if (entry?.allowText) {
    node.text = entry.defaultText ?? "";
  }

  // Compound components ship a ready-made child hierarchy so users don't have
  // to assemble (and risk breaking) the structure by hand.
  if (Array.isArray(entry?.preset)) {
    node.children = entry.preset.map(buildFromSpec);
  }

  return node;
}

/**
 * Build a node (and its descendants) from a preset spec.
 * A spec is either a type string or { type, text?, props?, children? }.
 */
function buildFromSpec(spec) {
  const type = typeof spec === "string" ? spec : spec.type;
  const node = createNode(type);

  if (spec && typeof spec === "object") {
    if (spec.text != null) node.text = spec.text;
    if (spec.props) node.props = { ...node.props, ...spec.props };
    if (Array.isArray(spec.children)) {
      node.children = spec.children.map(buildFromSpec);
    }
  }

  return node;
}

// ---------------------------------------------------------------------------
// Tree operations (immutable — operate on a deep clone, return new root list)
// ---------------------------------------------------------------------------

function clone(nodes) {
  return typeof structuredClone === "function"
    ? structuredClone(nodes)
    : JSON.parse(JSON.stringify(nodes));
}

function getChildList(rootNodes, containerId) {
  if (containerId === ROOT_ID) return rootNodes;
  const node = findNode(rootNodes, containerId);
  if (!node) return null;
  if (!Array.isArray(node.children)) node.children = [];
  return node.children;
}

export function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeNode(nodes, id) {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].id === id) {
      return nodes.splice(i, 1)[0];
    }
    if (nodes[i].children) {
      const removed = removeNode(nodes[i].children, id);
      if (removed) return removed;
    }
  }
  return null;
}

function isDescendant(node, targetId) {
  if (node.id === targetId) return true;
  if (!node.children) return false;
  return node.children.some((child) => isDescendant(child, targetId));
}

/** Add a brand-new node into a container at an optional index. */
export function addNode(rootNodes, type, containerId = ROOT_ID, index = null) {
  const next = clone(rootNodes);
  const list = getChildList(next, containerId);
  if (!list) return rootNodes;

  const node = createNode(type);
  if (index == null || index < 0 || index > list.length) {
    list.push(node);
  } else {
    list.splice(index, 0, node);
  }
  return { nodes: next, newId: node.id };
}

/** Move an existing node into a container at an optional index. */
export function moveNode(rootNodes, nodeId, containerId = ROOT_ID, index = null) {
  if (nodeId === containerId) return rootNodes;

  const next = clone(rootNodes);

  // Prevent moving a node into its own subtree.
  const moving = findNode(next, nodeId);
  if (!moving) return rootNodes;
  if (containerId !== ROOT_ID && isDescendant(moving, containerId)) {
    return rootNodes;
  }

  const removed = removeNode(next, nodeId);
  if (!removed) return rootNodes;

  const list = getChildList(next, containerId);
  if (!list) return rootNodes;

  if (index == null || index < 0 || index > list.length) {
    list.push(removed);
  } else {
    list.splice(index, 0, removed);
  }
  return next;
}

export function deleteNode(rootNodes, nodeId) {
  const next = clone(rootNodes);
  removeNode(next, nodeId);
  return next;
}

export function updateNodeProps(rootNodes, nodeId, props) {
  const next = clone(rootNodes);
  const node = findNode(next, nodeId);
  if (node) {
    node.props = { ...node.props, ...props };
    // Drop empty-string props to keep schema clean.
    for (const key of Object.keys(node.props)) {
      if (node.props[key] === "") delete node.props[key];
    }
  }
  return next;
}

export function updateNodeText(rootNodes, nodeId, text) {
  const next = clone(rootNodes);
  const node = findNode(next, nodeId);
  if (node) node.text = text;
  return next;
}

// ---------------------------------------------------------------------------
// Schema conversion
// ---------------------------------------------------------------------------

function serializeNode(node) {
  const out = { type: node.type };

  if (node.props && Object.keys(node.props).length > 0) {
    out.props = { ...node.props };
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    out.children = node.children.map(serializeNode);
  } else if (typeof node.text === "string" && node.text.length > 0) {
    out.children = node.text;
  }

  return out;
}

/**
 * Wrap the builder's root node list into a complete Weavo Page schema.
 */
export function treeToSchema(rootNodes) {
  return {
    type: "Page",
    children: [
      {
        type: "Main",
        children: rootNodes.map(serializeNode),
      },
    ],
  };
}

function deserializeNode(node) {
  if (typeof node === "string") {
    return { id: nextId(), type: "p", props: {}, text: node };
  }

  const builderNode = {
    id: nextId(),
    type: node.type,
    props: node.props ? { ...node.props } : {},
  };

  const { children } = node;

  if (typeof children === "string") {
    builderNode.text = children;
    if (isContainerType(node.type)) builderNode.children = [];
  } else if (Array.isArray(children)) {
    builderNode.children = children.map(deserializeNode);
  } else if (children && typeof children === "object") {
    builderNode.children = [deserializeNode(children)];
  } else if (isContainerType(node.type)) {
    builderNode.children = [];
  }

  return builderNode;
}

/**
 * Convert a stored Weavo schema back into the builder's root node list.
 * Unwraps the conventional Page > Main wrapper produced by treeToSchema.
 */
export function schemaToTree(schema) {
  if (!schema || typeof schema !== "object") return [];

  let topLevel = [];

  if (schema.type === "Page" && Array.isArray(schema.children)) {
    const main = schema.children.find((child) => child?.type === "Main");
    if (main && Array.isArray(main.children)) {
      topLevel = main.children;
    } else {
      topLevel = schema.children;
    }
  } else if (Array.isArray(schema.children)) {
    topLevel = schema.children;
  } else {
    topLevel = [schema];
  }

  return topLevel.map(deserializeNode);
}
