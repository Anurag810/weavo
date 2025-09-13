# 🌈 UI Framework — Dynamic SCSS + React + JSON Schema + Backend

## 🧠 Vision

A full-stack, dynamic UI framework with the following goals:

- 🎨 SCSS-based theming system that **doesn't hardcode variables**, but **accepts input** (CSS variables, tokens) for full theme control.
- ⚛️ A **React component library** that connects to the SCSS system and supports runtime theming.
- 📦 Ability to **serialize DOM structure + classNames into JSON** → enabling cross-platform UI (e.g. mobile).
- 🧱 JSON-based UI schemas can be **rendered back** into React, and later exported to iOS/Android.
- 🧩 Future drag-and-drop UI builder for no-code/low-code experience.
- 🔄 Backend support via **FastAPI (Python)** or **Express (Node.js)** with SQL/MongoDB for storage.

---

## 🧱 Core Modules Breakdown

### 🔹 1. SCSS Library (Dynamic Theming)
- Accepts external theme tokens (via CSS variables or config)
- SCSS structure supports full override of tokens
- Default + user-defined themes
- Classes like `.btn`, `.card`, `.input` adapt based on theme

### 🔹 2. React Component Library
- Built with React + SCSS
- Supports:
  - Themed components (`<Button>`, `<Input>`, etc.)
  - ThemeProvider (optional)
  - Hooks (e.g., `useTheme()`)
- Can render based on UI schema

### 🔹 3. JSON UI Schema Format

Example:
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
- [x] **Setup SCSS Project**  
  Create base folder for SCSS variables, mixins, and utilities.
- [x] **Design CSS Variable System**  
  Structure for injecting custom tokens via `:root {}` or themes.
- [ ] **Create Utility Classes**  
  Spacing, font sizes, border-radius, etc.
- [x] **Theme Tokens Placeholder**  
  Define default tokens (`--primary`, `--bg`, etc.) with override support.

### ⚛️ React Component Library (`react-components/`)
- [x] **Project Init (Vite + React + TS + SCSS)**  
  Fast dev env for building components.
- [ ] **Setup ThemeProvider (optional)**  
  Inject CSS variables dynamically via React context.
- [x] **Create Base Components**
    - [x] Button
    - [x] Input
    - [x] Card
    - [x] Badge
    - [x] Modal
    - [x] Accordion
    - [x] Tooltip
    - [x] ProgressBar
    - [x] Tabs / TabPanel
    - [x] Spinner

- [x] **Support Props for Theming**  
  Each component should accept `variant`, `size`, etc.
- [x] **Link to SCSS Core Styles**  
  Use shared styles from `scss-core`.

---

# ✅ v0.2 — JSON Schema & Renderer Engine

### 📦 Schema System (`schema-renderer/`)
- [x] **Define JSON Schema Format**  
  Structure for `type`, `props`, `styles`, `children`
- [x] **Create Schema Parser**  
  Translates JSON to actual React components.
- [x] **Basic Renderer Engine**  
  Recursively render schema → UI
- [x] **Handle Props + Style Mapping**  
  Apply props and inline styles correctly (partial completed)

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
- [x] Create repo with `packages/` and `apps/`
- [x] Init SCSS theme system + 1-2 UI components
- [x] Keep README + roadmap updated

Let me know when you want me to scaffold any part of it.

# Achevied Till now

# Weavo UI Library

## Overview
This library includes **17 reusable components** split between Layouts and UI. Some components are fully functional, while others require styling and interaction enhancements.

---

# 📌 Weavo Components Progress (Revised)

## 🏗 Layout Components (8/8)
| Component   | Status   | Notes |
|-------------|----------|-------|
| **Page**    | ✅ Done  | Needs styling |
| **Header**  | ✅ Done  | Needs styling |
| **Footer**  | ✅ Done  | Needs styling |
| **Sidebar** | ✅ Done  | Needs styling |
| **Main**    | ✅ Done  | Needs styling |
| **Section** | ✅ Done  | Needs styling |
| **Navbar**  | ✅ Done  | Needs styling |
| **Container** | ✅ Done | Needs styling |

---

## 🎨 UI Components (11/11)
| Component       | Status         | Notes |
|-----------------|----------------|-------|
| **Button**      | ✅ Done        | Needs styling |
| **Input**       | ✅ Done        | Needs styling |
| **Card**        | ✅ Done        | Needs styling |
| **Badge**       | ✅ Done        | Needs styling |
| **Modal**       | ✅ Done        | Needs styling |
| **Icons**       | ✅ Done        | Needs styling |
| **Accordion**   | ✅ Done        | Needs styling |
| **Tooltip**     | ✅ Done        | Needs styling |
| **ProgressBar** | ✅ Done        | Needs styling |
| **Tabs / TabPanel** | ✅ Done    | Needs styling |
| **Spinner**     | ✅ Done        | Needs styling |

---

### ✅ Summary
- **1p/19 implemented**  
- **All 19 need styling polish**    

---

## Tasks for future
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

