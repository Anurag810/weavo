import withWeavoStyles from "../withWeavoLayout";

// Layout components
export const Page = withWeavoStyles("div", "weavo-page", true);
export const Header = withWeavoStyles("header", "weavo-header", true);
export const Footer = withWeavoStyles("footer", "weavo-footer", true);
export const Sidebar = withWeavoStyles("aside", "weavo-sidebar");
export const Main = withWeavoStyles("main", "weavo-main", true);
export const Section = withWeavoStyles("section", "weavo-section", true);
export const Container = withWeavoStyles("div", "weavo-container", true);

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
