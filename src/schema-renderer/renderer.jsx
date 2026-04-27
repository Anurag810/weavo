import React from "react";
import { ComponentMap } from "../components";
import a from "../js/event-handlers";
import handleListners from "../js/event-handlers";


export function renderNode(node, key = "weavo") {
    if (!node) return null;

    // Handle plain string node
    if (typeof node === "string") {
        return <React.Fragment key={key}>{node}</React.Fragment>;
    }

    const { type, props = {}, styles = {}, children } = node;
    const listeners = props.listeners || {}

    
    const Component = ComponentMap[type] || type;

    let renderedChildren = null;

    // Handle array children
    if (Array.isArray(children)) {
        renderedChildren = children.map((child, i) =>
            renderNode(child, `${key}-${i}`)
        );
    }
    // Handle string children
    else if (typeof children === "string") {
        renderedChildren = children;
    }
    // Handle object child
    else if (children && typeof children === "object") {
        renderedChildren = renderNode(children, `${key}-0`);
    }

    return (
        <Component {...props} onClick={(event) => {
                handleListners(listeners, event);
            }} style={styles} key={key}>
            {renderedChildren}
        </Component>
    );

}

// let handle_listeners = (listener, event) => {
//     console.log("Handling listeners", listener);
//     a.onClick(event);
//     if (typeof listener === "string") {
//         eval(listener);
//     }
// }

