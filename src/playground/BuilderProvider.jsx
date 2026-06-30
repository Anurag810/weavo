import { createContext, useContext, useMemo, useReducer, useRef } from "react";
import {
  ROOT_ID,
  addNode,
  moveNode,
  deleteNode,
  updateNodeProps,
  updateNodeText,
  schemaToTree,
} from "./schema-tree.js";

const BuilderContext = createContext(null);

const initialState = {
  nodes: [],
  selectedId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const result = addNode(state.nodes, action.nodeType, action.containerId ?? ROOT_ID, action.index ?? null);
      if (Array.isArray(result)) return state; // unchanged
      return { nodes: result.nodes, selectedId: result.newId };
    }
    case "MOVE": {
      const nodes = moveNode(state.nodes, action.nodeId, action.containerId ?? ROOT_ID, action.index ?? null);
      return { ...state, nodes };
    }
    case "DELETE": {
      const nodes = deleteNode(state.nodes, action.nodeId);
      const selectedId = state.selectedId === action.nodeId ? null : state.selectedId;
      return { nodes, selectedId };
    }
    case "UPDATE_PROPS": {
      const nodes = updateNodeProps(state.nodes, action.nodeId, action.props);
      return { ...state, nodes };
    }
    case "UPDATE_TEXT": {
      const nodes = updateNodeText(state.nodes, action.nodeId, action.text);
      return { ...state, nodes };
    }
    case "SELECT": {
      return { ...state, selectedId: action.nodeId };
    }
    case "LOAD": {
      return { nodes: schemaToTree(action.schema), selectedId: null };
    }
    case "CLEAR": {
      return { nodes: [], selectedId: null };
    }
    default:
      return state;
  }
}

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // dispatch is stable, so the action creators only need to be built once.
  const actionsRef = useRef(null);
  if (actionsRef.current === null) {
    actionsRef.current = {
      addNode: (nodeType, containerId, index) => dispatch({ type: "ADD", nodeType, containerId, index }),
      moveNode: (nodeId, containerId, index) => dispatch({ type: "MOVE", nodeId, containerId, index }),
      deleteNode: (nodeId) => dispatch({ type: "DELETE", nodeId }),
      updateProps: (nodeId, props) => dispatch({ type: "UPDATE_PROPS", nodeId, props }),
      updateText: (nodeId, text) => dispatch({ type: "UPDATE_TEXT", nodeId, text }),
      select: (nodeId) => dispatch({ type: "SELECT", nodeId }),
      load: (schema) => dispatch({ type: "LOAD", schema }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }

  const value = useMemo(
    () => ({
      nodes: state.nodes,
      selectedId: state.selectedId,
      ...actionsRef.current,
    }),
    [state.nodes, state.selectedId]
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("[Weavo] useBuilder must be used within a BuilderProvider");
  }
  return context;
}

export default BuilderContext;
