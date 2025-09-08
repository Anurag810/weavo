import React from "react";
// Higher-Order Component to wrap layouts
const withWeavoStyles = (Component, className, is_flex=false, is_grid=false) => {
    return ({ children, style = {}, ...props }) => {
        let classes = className;

        if (is_flex) {
            classes += " flex";
            if (props.direction === "column") classes += " flex-column";
            else if (props.direction === "row") classes += " flex-row";
        }
        if (is_grid) {
            classes += " grid";
            if (props.columns) classes += ` grid-cols-${props.columns}`;
        }
        return (
            <Component className={classes} style={style} {...props}>
                {children}
            </Component>
        );
    };
};

export default withWeavoStyles