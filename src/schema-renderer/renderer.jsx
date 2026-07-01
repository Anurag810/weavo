import React from "react";
import { ComponentMap } from "../components";
import { bindListeners } from "../js/event-handlers";
import { getScope, resolveDeep, resolveTemplate } from "./template.js";

export { validateSchema, validateNode } from "./validate-schema.js";

export function renderNode(node, key = "weavo", context = {}) {
  if (node == null) return null;

  const scope = getScope(context);

  if (typeof node === "string") {
    return <React.Fragment key={key}>{scope ? resolveTemplate(node, scope) : node}</React.Fragment>;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => renderNode(child, `${key}-${index}`, context));
  }

  const { type, props = {}, styles = {}, children, listeners: rootListeners = {} } = node;
  const { listeners: propListeners = {}, ...componentProps } = props;
  const listeners = { ...rootListeners, ...propListeners };

  const Component = ComponentMap[type] || type;

  let renderedChildren = null;

  if (Array.isArray(children)) {
    renderedChildren = children.map((child, i) =>
      renderNode(child, `${key}-${i}`, context)
    );
  } else if (typeof children === "string") {
    renderedChildren = scope ? resolveTemplate(children, scope) : children;
  } else if (children && typeof children === "object") {
    renderedChildren = renderNode(children, `${key}-0`, context);
  }

  // Bind data-source templates ({{ data.x }}) against the active scope.
  const resolvedProps = scope ? resolveDeep(componentProps, scope) : componentProps;
  const resolvedStyles = scope ? resolveDeep(styles, scope) : styles;

  const boundProps = bindListeners(resolvedProps, listeners, context);
  const mergedStyle = { ...resolvedProps.style, ...resolvedStyles };

  return (
    <Component {...boundProps} style={mergedStyle} key={key}>
      {renderedChildren}
    </Component>
  );
}
