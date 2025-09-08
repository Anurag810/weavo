import React from "react";
import withWeavoStyles from "../withWeavoLayout";

// ================= UI Components =================
export const Accordion = withWeavoStyles("div", "weavo-accordion", true);
export const ProgressBar = withWeavoStyles("div", "weavo-progress-bar", true);
export const TabPanel = withWeavoStyles("div", "weavo-tabs", true);

export const Card = withWeavoStyles("div", "weavo-card", true);
Card.Header = withWeavoStyles("div", "weavo-card-header", true);
Card.Body = withWeavoStyles("div", "weavo-card-body", true);
Card.Footer = withWeavoStyles("div", "weavo-card-footer", true);

// export const Badge = withWeavoStyles("span", "weavo-badge", true);

export const Badge = ({ label, variant = "primary", children, ...props }) => {
  const className = `weavo-badge weavo-badge-${variant}`;
  return <span className={className} {...props}>{children}</span>;
};

export const Button = ({ label, variant = "primary", ...props }) => {
  const className = `weavo-btn weavo-btn-${variant}`;
  return <button className={className} {...props}>{label}</button>;
};

export const Input = ({ placeholder, type = "text", ...props }) => {
  return <input className="weavo-input" type={type} placeholder={placeholder} {...props} />;
};

export const Modal = ({ isOpen, title, children, onClose, ...props }) => {
  if (!isOpen) return null;
  return (
    <div className="weavo-modal-overlay" onClick={onClose}>
      <div className="weavo-modal" {...props} onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export const Tooltip = ({ content, children }) => {
  return (
    <div className="weavo-tooltip-wrapper">
      {children}
      <span className="weavo-tooltip">{content}</span>
    </div>
  );
};

export const Spinner = ({ size = "40px", color = "var(--primary)" }) => {
  return <div className="weavo-spinner" style={{ width: size, height: size, borderColor: color }}></div>;
};

import * as LucideIcons from "lucide-react";

export const Icon = ({ name, size = 16, iconColor = "currentColor", ...props }) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  return <LucideIcon size={size} color={iconColor} {...props} />;
};

