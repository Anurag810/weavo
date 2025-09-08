import React from "react";
import { ComponentMap } from "../components";


export function renderNode(node) {
    if (!node) return null;

    if (typeof node == "string") {
        return <>{node}</>
    }

    const { type, props = {}, styles = {}, children } = node;
    const Component = ComponentMap[type] || type;

    if (Array.isArray(children)) {
        return (
            <Component {...props} style={styles}>
                {children.map((child, i) => (
                    <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
                ))}
            </Component>
        );
    }

    if (typeof children === "string") {
        return (
            <Component {...props} style={styles}>
                {children}
            </Component>
        );
    }

    // no children provided → self-closing component
    return <Component {...props} style={styles} />;
}
