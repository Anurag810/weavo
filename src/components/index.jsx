// layouts
export { Page, Header, Footer, Sidebar, Main, Section, Navbar } from './layouts';
// ui
export { Button, Input, Card, Badge, Modal, Accordion, Tooltip, ProgressBar, TabPanel, Spinner } from './ui';

// export { Dropdown } from './ui/Dropdown';     
// export { Avatar } from './ui/Avatar';         
// export { Toast } from './ui/Toast';           
// export { Stepper } from './ui/Stepper';       
// export { Table } from './ui/Table';           

// ComponentMap
import * as Layouts from './layouts';
import * as UI from './ui';

export const ComponentMap = {
  ...Layouts,
  ...UI,
//   Dropdown: UI.Dropdown,
//   Avatar: UI.Avatar,
//   Toast: UI.Toast,
//   Stepper: UI.Stepper,
//   Table: UI.Table,
};
