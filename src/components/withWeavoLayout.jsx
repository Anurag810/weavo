import React from "react";
// Higher-Order Component to wrap layouts
const withWeavoStyles = (Component, className, is_flex=false, is_grid=false) => {
    return ({ children, style = {}, className: extraClass, direction, columns, ...props }) => {
        let classes = className;

        if (is_flex) {
            classes += " flex";
            if (direction === "column") classes += " flex-column";
            else if (direction === "row") classes += " flex-row";
        }
        if (is_grid) {
            classes += " weavo-grid";
            if (columns) classes += ` weavo-grid-cols-${columns}`;
        }
        if (extraClass) classes += ` ${extraClass}`;

        return (
            <Component className={classes} style={style} {...props}>
                {children}
            </Component>
        );
    };
};

export default withWeavoStyles