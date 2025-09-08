# 🌈 UI Framework Idea — Dynamic SCSS + React + JSON Schema + Backend

## 🧠 Vision

A full-stack, dynamic UI framework with the following goals:

- 🎨 SCSS-based theming system that **doesn't hardcode variables**, but **accepts input** (CSS variables, tokens) for full theme control.
- ⚛️ A **React component library** that connects to the SCSS system and supports runtime theming.
- 📦 Ability to **serialize DOM structure + classNames into JSON** (or custom format) → enabling cross-platform UI (e.g. mobile).
- 🧱 JSON-based UI schemas can be **rendered back** into React, and later exported to iOS/Android.
- 🧩 Future drag-and-drop UI builder for no-code/low-code experience.
- 🔄 Backend support via **FastAPI (Python)** or **Express (Node.js)** with SQL/MongoDB for storage.

---

## 🧱 Core Modules Breakdown

### 🔹 1. SCSS Library (Dynamic Theming)
- Accepts external theme tokens (via CSS variables or config)
- SCSS structure supports full override of tokens
- Can provide default + user-defined themes
- Classes like `.btn`, `.card`, `.input` adapt based on theme

---

### 🔹 2. React Component Library
- Built with React + SCSS
- Supports:
  - Themed components (`<Button>`, `<Input>`, etc.)
  - ThemeProvider (optional)
  - Hooks (e.g., `useTheme()`)
- Can render based on UI schema

---

### 🔹 3. JSON UI Schema Format
- Each component's DOM, props, and styles are serializable
- Example:
```json
{
  "type": "Button",
  "props": {
    "label": "Submit",
    "variant": "primary"
  },
  "styles": {
    "padding": "16px",
    "color": "var(--primary)"
  }
}
```

----

```
    weavo/                     # root = main app (monolithic)
    ├── src/
    │   ├── scss-core/         # tokens, mixins, utilities (SCSS files)
    │   ├── components/        # React components (Button, Input, Card...)
    │   ├── theme-system/      # ThemeProvider, useTheme, theme storage logic
    │   ├── schema-renderer/   # JSON → React renderer + schema definitions
    │   ├── builder/           # PLACEHOLDER: drag & drop builder (UI → JSON)
    │   │   ├── README.md
    │   │   └── mock-schemas/  # sample schemas produced by the builder
    │   └── targets/           # placeholders for export-target logic
    │       ├── web/
    │       ├── ios/
    │       └── android/
    ├── backend/               # simple API (save/load schema + theme)
    ├── public/                # static assets
    ├── docs/                  # docs / design decisions / schema spec
    ├── examples/              # demo pages / sample apps using weavo
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── README.md
    └── LICENSE
```

----
# 🗂️ Task Breakdown for Dynamic SCSS + React + JSON UI Framework

This task list breaks the entire project into smaller, achievable milestones across multiple versions.

---

## 🚧 Versioning Plan

| Version | Goals |
|---------|-------|
| **v0.1** | Core SCSS theming system + basic React components |
| **v0.2** | JSON schema structure + renderer engine |
| **v0.3** | Backend API for schema/theme storage |
| **v0.4** | CLI to scaffold themes/components/projects |
| **v0.5** | Docs site + live playground |
| **v1.0** | Basic drag-and-drop builder (MVP) |

---

# ✅ v0.1 — Core Foundation (Theme Engine + UI Library)

### 🎨 SCSS Theming System (`scss-core/`)
- [ ] **Setup SCSS Project**  
  Create base folder for SCSS variables, mixins, and utilities.
- [ ] **Design CSS Variable System**  
  Structure for injecting custom tokens via `:root {}` or themes.
- [ ] **Create Utility Classes**  
  Spacing, font sizes, border-radius, etc.
- [ ] **Theme Tokens Placeholder**  
  Define default tokens (`--primary`, `--bg`, etc.) with override support.

### ⚛️ React Component Library (`react-components/`)
- [ ] **Project Init (Vite + React + TS + SCSS)**  
  Fast dev env for building components.
- [ ] **Setup ThemeProvider (optional)**  
  Inject CSS variables dynamically via React context.
- [ ] **Create Base Components**
  - [ ] `<Button />`
  - [ ] `<Input />`
  - [ ] `<Card />`
- [ ] **Support Props for Theming**  
  Each component should accept `variant`, `size`, etc.
- [ ] **Link to SCSS Core Styles**  
  Use shared styles from `scss-core`.

---

# ✅ v0.2 — JSON Schema & Renderer Engine

### 📦 Schema System (`schema-renderer/`)
- [ ] **Define JSON Schema Format**  
  Structure for `type`, `props`, `styles`, `children`
- [ ] **Create Schema Parser**  
  Translates JSON to actual React components.
- [ ] **Basic Renderer Engine**  
  Recursively render schema → UI
- [ ] **Handle Props + Style Mapping**  
  Apply props and inline styles correctly

---

# ✅ v0.3 — Backend API for Theme & Schema Storage

### 🌐 API Layer (`backend-api/`)
- [ ] **Choose Backend**: FastAPI or Express (your call)
- [ ] **Init Project**  
  Setup project with routing, CORS, .env, etc.
- [ ] **Define Routes**:
  - [ ] `POST /schema` – Save schema
  - [ ] `GET /schema/:id` – Load schema
  - [ ] `POST /theme` – Save theme
  - [ ] `GET /theme/:id` – Load theme
- [ ] **DB Integration**:
  - [ ] MongoDB via Mongoose
  - [ ] OR PostgreSQL via Prisma/SQLAlchemy
- [ ] **Schema Validation**  
  Ensure uploaded JSON is valid
- [ ] **Auth (Optional)**  
  JWT-based token system

---

# ✅ v0.4 — CLI Tool for Project/Themes

### 🛠️ CLI Utility (`cli/`)
- [ ] **Scaffold New Projects**  
  `npx your-cli create-app`
- [ ] **Scaffold New Components**  
  `your-cli generate component Button`
- [ ] **Theme Scaffold**  
  `your-cli generate theme dark-mode`
- [ ] **Support Local + Remote Schema Usage**  
  CLI fetches and renders JSON from API

---

# ✅ v0.5 — Docs + Live Playground

### 📚 Documentation Site (`docs-site/`)
- [ ] **Init with Docusaurus or VitePress**
- [ ] **Document SCSS Token System**
- [ ] **Document React Components + Props**
- [ ] **Document JSON Schema Format**
- [ ] **Live Editor + Preview**  
  Use CodeMirror + renderer engine

---

# ✅ v1.0 — UI Builder MVP

### 🧩 Drag & Drop Builder (`builder-ui/`)
- [ ] **Project Setup (React + SCSS + DnD)**
- [ ] **Component Palette**  
  Sidebar with available components
- [ ] **Canvas Area**  
  Drop zone where components can be placed
- [ ] **Auto-generate JSON Schema**
- [ ] **Live Preview (Right Panel)**
- [ ] **Save to API**
- [ ] **Import Existing Schema**
- [ ] **Export as JSON / React Code**

---

# 🧰 Miscellaneous / Cross-Version

- [ ] **Monorepo Tooling**  
  Use Turborepo / Nx / Yarn workspaces
- [ ] **Linting + Prettier + Husky Hooks**
- [ ] **CI/CD (GitHub Actions)**  
  Build check, test, lint
- [ ] **MIT License**
- [ ] **README.md with badges**
- [ ] **Contributing.md**

---

# 🏁 Total Milestone Summary

| Module | Task Count |
|--------|------------|
| SCSS Core | 4 |
| React Components | 6 |
| Schema Renderer | 4 |
| Backend API | 6 |
| CLI Tool | 4 |
| Docs Site | 5 |
| UI Builder | 8 |
| Miscellaneous | 6 |

Total Tasks: **~43 (modular & scalable)**

---

# 🧩 Next Step Suggestion

Start with `v0.1`:
- [ ] Create repo with `packages/` and `apps/`
- [ ] Init SCSS theme system + 1-2 UI components
- [ ] Keep README + roadmap updated

Let me know when you want me to scaffold any part of it.

# Achevied Till now

# Weavo UI Library

## Overview
This library includes **17 reusable components** split between Layouts and UI. Some components are fully functional, while others require styling and interaction enhancements.

---

## Layout Components (8)

| Component | Status | Notes |
|-----------|--------|------|
| **Page** | ✅ Works | Uses HOC with `weavo-page` |
| **Header** | ✅ Works | HOC applied |
| **Footer** | ✅ Works | HOC applied |
| **Sidebar** | ✅ Works | HOC applied |
| **Main** | ✅ Works | HOC applied |
| **Section** | ✅ Works | HOC applied |
| **Navbar** | ✅ Needs review | Works if items passed; styling may need enhancement |
| **Navbar** | ✅ Needs review | Works if items passed; styling may need enhancement |
| **Container** | ✅ Needs review | Works if items passed; styling may need enhancement |

---

## UI Components (10)

| Component | Status | Notes |
|-----------|--------|------|
| **Button** | ✅ Works | Variants properly mapped |
| **Input** | ✅ Works | Basic input works |
| **Card** | ✅ Works | Background and padding in CSS needed |
| **Badge** | ✅ Works | needing sizing |
| **Modal** | ⚠️ Partially working | Overlay close works; needs styling & accessibility improvements |
| **Icons** | ⚠️ In progress | Visual spinner missing, currently just a div |
| **Accordion** | ⚠️ Needs work | Toggle functionality not implemented fully |
| **Tooltip** | ⚠️ Needs SCSS | Placement, visibility, and styling missing |
| **ProgressBar** | ⚠️ Needs SCSS | Fill animation & background styling missing |
| **TabPanel** | ⚠️ Needs SCSS | Tab switch works, visual styling missing |
| **Spinner** | ⚠️ Needs SCSS | Visual spinner missing, currently just a div |

---

## Tasks & Priorities
1. **Styling & SCSS**
   - Badge, Tooltip, ProgressBar, TabPanel, Spinner, Modal, Accordion
2. **Interactions**
   - Accordion toggle
   - Modal accessibility (keyboard, focus trap)
3. **Consistency**
   - Make Navbar visually consistent with Header/Footer
   - Ensure spacing, border-radius, and color variables applied across all components
4. **Enhancements (Optional)**
   - Add Dropdown, Avatar, Toast, Stepper, Table components
   - Add animation for ProgressBar and Spinner

---

## Variables
All components use **CSS variables** defined in `variables.scss` to maintain consistent colors, spacing, and typography.

```scss
:root {
  /* Core Colors */
  --primary: #1e90ff;
  --primary-hover: #1c86ee;
  --primary-focus: rgba(30,144,255,0.3);
  --secondary: #f5f5f5;
  --secondary-hover: #e0e0e0;
  --bg: #ffffff;
  --bg-hover: #f9f9f9;
  --text: #333333;
  --accent: #ff4081;

  /* Layout Backgrounds */
  --sidebar-bg: #f0f0f0;
  --header-bg: #f8f9fa;
  --footer-bg: #f1f3f5;
  --main-bg: #ffffff;
  --section-bg: transparent;
  --navbar-bg: #ffffff;

  /* Cards */
  --card-bg: #ffffff;
  --card-shadow: 0 2px 8px rgba(0,0,0,0.05);
  --card-hover-shadow: 0 4px 12px rgba(0,0,0,0.08);

  /* Buttons */
  --btn-primary-bg: var(--primary);
  --btn-primary-color: #ffffff;
  --btn-primary-hover-bg: var(--primary-hover);
  --btn-primary-focus-shadow: var(--primary-focus);

  --btn-secondary-bg: var(--secondary);
  --btn-secondary-color: var(--text);
  --btn-secondary-hover-bg: var(--secondary-hover);

  --btn-default-bg: transparent;
  --btn-default-color: var(--text);
  --btn-default-border: var(--text);
  --btn-default-hover-bg: var(--bg-hover);

  /* Inputs */
  --input-bg: #ffffff;
  --input-border: #cccccc;
  --input-focus-border: var(--primary);
  --input-focus-shadow: rgba(30,144,255,0.2);
  --input-placeholder: rgba(51,51,51,0.5);
  --input-disabled-bg: #f5f5f5;
  --input-disabled-opacity: 0.6;

  /* Modals, Tooltip, Accordion, Progress, Tabs, Spinner */
  --modal-bg: #ffffff;
  --modal-overlay-bg: rgba(0,0,0,0.5);
  --accordion-bg: #ffffff;
  --tooltip-bg: #333333;
  --progress-bg: #e0e0e0;
  --progress-fill-bg: var(--primary);
  --tab-bg: #ffffff;
  --spinner-bg: transparent;

  /* Spacing & Sizing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  --font-base: 16px;
  --font-large: 20px;
}

