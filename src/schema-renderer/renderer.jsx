import React from "react";
import { ComponentMap } from "../components";
import { bindListeners } from "../js/event-handlers";

export function renderNode(node, key = "weavo", context = {}) {
  if (!node) return null;

  if (typeof node === "string") {
    return <React.Fragment key={key}>{node}</React.Fragment>;
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
    renderedChildren = children;
  } else if (children && typeof children === "object") {
    renderedChildren = renderNode(children, `${key}-0`, context);
  }

  const boundProps = bindListeners(componentProps, listeners, context);

  return (
    <Component {...boundProps} style={styles} key={key}>
      {renderedChildren}
    </Component>
  );
}
