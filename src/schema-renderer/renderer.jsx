import React from "react";
import { ComponentMap } from "../components";


export function renderNode(node, key = "weavo") {
    if (!node) return null;

    // Handle plain string node
    if (typeof node === "string") {
        return <React.Fragment key={key}>{node}</React.Fragment>;
    }

    const { type, props = {}, styles = {}, children } = node;
    const Component = ComponentMap[type] || type;

    // Handle array children
    if (Array.isArray(children)) {
        return (
            <Component {...props} style={styles} key={key}>
                {children.map((child, i) => renderNode(child, `${key}-${i}`))}
            </Component>
        );
    }

    // Handle string children
    if (typeof children === "string") {
        return (
            <Component {...props} style={styles} key={key}>
                {children}
            </Component>
        );
    }

    // Handle nested object child
    if (children && typeof children === "object") {
        // Handle children as object (NOT TESTED YET)
        // This supports cases where schema provides a single child object
        // instead of an array. Could be useful in future features like:
        // For now, this is safe but not actively used.
        return (
            <Component {...props} style={styles} key={key}>
                {renderNode(children, `${key}-0`)}
            </Component>
        );
    }

    // Component without children
    return <Component {...props} style={styles} key={key} />;
}

