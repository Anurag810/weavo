// layouts
export { Page, Header, Footer, Sidebar, Main, Section, Navbar } from './layouts';
// ui
export { Button, Input, Card, Badge, Modal, Accordion, Tooltip, Tabs, Spinner, ProgressBar } from './ui';
       
// ComponentMap
import * as Layouts from './layouts';
import * as UI from './ui';

export const ComponentMap = {
  ...Layouts,
  ...UI,
  "Card.Header": UI.Card.Header,
  "Card.Body": UI.Card.Body,
  "Card.Footer": UI.Card.Footer,
  "Tabs.TabList": UI.Tabs.TabList,
  "Tabs.Tab": UI.Tabs.Tab,
  "Tabs.TabPanel": UI.Tabs.TabPanel,
  "Accordion.Item": UI.Accordion.Item,
  "Accordion.Header": UI.Accordion.Header,
  "Accordion.Panel": UI.Accordion.Panel,
  "Modal.Header": UI.Modal.Header,
  "Modal.Body": UI.Modal.Body,
  "Modal.Footer": UI.Modal.Footer
};


//   Dropdown: UI.Dropdown,
//   Avatar: UI.Avatar,
//   Toast: UI.Toast,
//   Stepper: UI.Stepper,
//   Table: UI.Table,