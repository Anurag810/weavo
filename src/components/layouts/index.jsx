import React from "react";

// Higher-Order Component to wrap layouts
const withWeavoStyles = (Component, className) => {
  return ({ children, style = {}, ...props }) => {
    return (
      <Component className={className} style={style} {...props}>
        {children}
      </Component>
    );
  };
};

// Layout components
export const Page = withWeavoStyles("div", "weavo-page");
export const Header = withWeavoStyles("header", "weavo-header");
export const Footer = withWeavoStyles("footer", "weavo-footer");
export const Sidebar = withWeavoStyles("aside", "weavo-sidebar");
export const Main = withWeavoStyles("main", "weavo-main");
export const Section = withWeavoStyles("section", "weavo-section");

// ==================== Navbar ====================
export function Navbar({ items = [], style = {}, align = "start", ...props }) {
  return (
    <nav className="weavo-navbar" style={style} {...props}>
      {items.map((item, i) => (
        <a key={i} href={item.href || "#"}>{item.label}</a>
      ))}
    </nav>
  );
}
