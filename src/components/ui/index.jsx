import React from "react";
import withWeavoStyles from "../withWeavoLayout";
import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

// ================= UI Components =================
export const Card = withWeavoStyles("div", "weavo-card", true);
Card.Header = withWeavoStyles("div", "weavo-card-header", true);
Card.Body = withWeavoStyles("div", "weavo-card-body", true);
Card.Footer = withWeavoStyles("div", "weavo-card-footer", true);

export const List = withWeavoStyles("ul", "weavo-list");
export const ListItem = withWeavoStyles("li", "weavo-list-item");

// export const Badge = withWeavoStyles("span", "weavo-badge", true);

export const Badge = ({ label, variant = "primary", children, ...props }) => {
  const className = `weavo-badge weavo-badge-${variant}`;
  return <span className={className} {...props}>{children}</span>;
};

export const Button = ({ label, variant = "primary", size, children, className = "", ...props }) => {
  const classes = ["weavo-btn", `weavo-btn-${variant}`, size, className].filter(Boolean).join(" ");
  return <button className={classes} {...props}>{children ?? label}</button>;
};

export const Input = ({ placeholder, type = "text", ...props }) => {
  return <input className="weavo-input" type={type} placeholder={placeholder} {...props} />;
};

export const Radio = ({ label, children, className = "", ...props }) => {
  return (
    <label className={`weavo-radio ${className}`.trim()}>
      <input type="radio" className="weavo-radio-input" {...props} />
      <span className="weavo-radio-label">{label ?? children}</span>
    </label>
  );
};

export const RadioGroup = ({
  name,
  options = [],
  defaultValue,
  direction = "row",
  onChange,
  className = "",
  ...props
}) => {
  const [selected, setSelected] = useState(
    () => defaultValue ?? document.documentElement.getAttribute("data-theme") ?? options[0]?.value ?? ""
  );

  const handleChange = (value) => {
    setSelected(value);
    onChange?.({ type: "change", target: { value } });
  };

  return (
    <div className={`weavo-radio-group weavo-radio-group-${direction} ${className}`.trim()} {...props}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          checked={selected === option.value}
          onChange={() => handleChange(option.value)}
        />
      ))}
    </div>
  );
};

const BaseSpinner = ({ size = "md", ...props }) => {
  return <div className={`weavo-spinner ${size}`} {...props} />;
};

export const Spinner = withWeavoStyles(BaseSpinner, "weavo-spinner-wrapper", true);

export const Icon = ({ name, size = 16, iconColor = "currentColor", ...props }) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  return <LucideIcon size={size} color={iconColor} {...props} />;
};

export const Tooltip = ({ children, content, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="weavo-tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={`weavo-tooltip weavo-tooltip-${position}`}>
          {content}
        </span>
      )}
    </div>
  );
};

export const Tabs = ({ defaultIndex = 0, children }) => {
    const [active, setActive] = useState(defaultIndex);

    const tabList = React.Children.toArray(children).find(
        c => c.type?.displayName === "TabList"
    );
    const panels = React.Children.toArray(children).filter(
        c => c.type?.displayName === "TabPanel"
    );

    return (
        <div className="weavo-tabs">
            {tabList && React.cloneElement(tabList, { active, setActive })}
            {panels[active]}
        </div>
    );
};

Tabs.TabList = ({ children, active, setActive }) => (
  <div className="weavo-tab-list">
    {React.Children.map(children, (child, i) =>
      React.cloneElement(child, {
        isActive: i === active,
        onClick: () => setActive(i),
      })
    )}
  </div>
);

Tabs.Tab = ({ children, isActive, onClick }) => (
  <button
    className={`weavo-tab ${isActive ? "weavo-tab-active" : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);

Tabs.TabPanel = ({ children }) => (
  <div className="weavo-tab-panel">{children}</div>
);

// give them names for schema rendering safety
Tabs.TabList.displayName = "TabList";
Tabs.Tab.displayName = "Tab";
Tabs.TabPanel.displayName = "TabPanel";

// Root Accordion
export const Accordion = ({ allowMultiple = false, defaultIndex = [], children }) => {
  const [openItems, setOpenItems] = useState(
    Array.isArray(defaultIndex) ? defaultIndex : [defaultIndex]
  );

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="weavo-accordion">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: openItems.includes(index),
          onToggle: () => toggleItem(index),
          index,
        })
      )}
    </div>
  );
};

// Accordion Item
Accordion.Item = ({ children, isOpen, onToggle, index }) => (
  <div className="weavo-accordion-item">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { isOpen, onToggle, index })
    )}
  </div>
);

// Header (button)
Accordion.Header = ({ children, isOpen, onToggle, index }) => (
  <button
    className={`weavo-accordion-header ${isOpen ? "open" : ""}`}
    onClick={onToggle}
    aria-expanded={isOpen}
    aria-controls={`weavo-panel-${index}`}
    id={`weavo-header-${index}`}
  >
    {children}
  </button>
);

// Panel (collapsible)
Accordion.Panel = ({ children, isOpen, index }) => (
  <div
    id={`weavo-panel-${index}`}
    role="region"
    aria-labelledby={`weavo-header-${index}`}
    className={`weavo-accordion-panel ${isOpen ? "open" : ""}`}
    style={{
      maxHeight: isOpen ? "500px" : "0px", // TODO: replace with animation in CSS
      overflow: "hidden",
      transition: "max-height 0.3s ease",
    }}
  >
    <div className="weavo-accordion-panel-content">{children}</div>
  </div>
);

export const ProgressBar = ({ value = 10, size = "md", variant = "primary", speed = "slow" }) => {
  const Fill = withWeavoStyles("div", `weavo-progress-fill ${variant} ${speed}`);
  return (
    <div className={`weavo-progress-bar ${size}`}>
      <Fill style={{ width: `${value}%` }} />
    </div>
  );
};

export const Modal = ({ defaultOpen = false, onClose, size = "md", speed = "normal", children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === Modal.Header) {
      return React.cloneElement(child, { onClose: close });
    }
    return child;
  });

  return (
    <div className="weavo-modal-overlay" onClick={close}>
      <div
        className={`weavo-modal ${size} ${speed}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {enhancedChildren}
      </div>
    </div>
  );
};

Modal.Header = ({ children, onClose }) => (
  <div className="weavo-modal-header">
    <span>{children}</span>
    {onClose && (
      <button type="button" className="weavo-modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
    )}
  </div>
);
Modal.Body = ({ children }) => <div className="weavo-modal-body">{children}</div>;
Modal.Footer = ({ children }) => <div className="weavo-modal-footer">{children}</div>;



