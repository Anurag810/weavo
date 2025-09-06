import React from "react";

// Button
export const Button = ({ label, variant = 'primary', ...props }) => {
  const className = `weavo-btn weavo-btn-${variant}`;
  return <button className={className} {...props}>{label}</button>;
};

// Input
export const Input = ({ placeholder, type = 'text', ...props }) => {
  return <input className="weavo-input" type={type} placeholder={placeholder} {...props} />;
};

// Card
export const Card = ({ children, ...props }) => {
  return <div className="weavo-card" {...props}>{children}</div>;
};

// Badge
export const Badge = ({ label, color = 'accent', ...props }) => {
  return <span className={`weavo-badge weavo-badge-${color}`} {...props}>{label}</span>;
};

// Modal
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

// Accordion
export const Accordion = ({ items = [] }) => {
  return (
    <div className="weavo-accordion">
      {items.map((item, i) => (
        <div key={i} className="weavo-accordion-item">
          <button className="weavo-accordion-header">{item.title}</button>
          <div className="weavo-accordion-body">{item.content}</div>
        </div>
      ))}
    </div>
  );
};

// Tooltip
export const Tooltip = ({ content, children }) => {
  return (
    <div className="weavo-tooltip-wrapper">
      {children}
      <span className="weavo-tooltip">{content}</span>
    </div>
  );
};

// ProgressBar
export const ProgressBar = ({ value = 0, max = 100 }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="weavo-progress-bar">
      <div className="weavo-progress-fill" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// TabPanel
export const TabPanel = ({ tabs = [] }) => {
  const [active, setActive] = React.useState(0);
  return (
    <div className="weavo-tabs">
      <div className="weavo-tab-headers">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActive(i)} className={i === active ? 'active' : ''}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="weavo-tab-content">{tabs[active]?.content}</div>
    </div>
  );
};

// Spinner
export const Spinner = ({ size = '40px', color = 'var(--primary)' }) => {
  return <div className="weavo-spinner" style={{ width: size, height: size, borderColor: color }}></div>;
};
