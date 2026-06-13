import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSchemaIdFromHash, setSchemaHash } from "./hash-routing.js";

const WeaveContext = createContext(null);

export function WeaveProvider({ weave, children }) {
  const [activeSchemaId, setActiveSchemaIdState] = useState(() => {
    return getSchemaIdFromHash(weave) ?? weave.default;
  });

  const setActiveSchema = useCallback(
    (schemaId, { updateHash = true } = {}) => {
      if (!weave.schemas[schemaId]) {
        console.warn(`[Weavo] Unknown schema id: "${schemaId}"`);
        return false;
      }

      setActiveSchemaIdState(schemaId);

      if (updateHash) {
        setSchemaHash(schemaId);
      }

      return true;
    },
    [weave]
  );

  useEffect(() => {
    const syncFromHash = () => {
      const id = getSchemaIdFromHash(weave);
      if (id) {
        setActiveSchemaIdState(id);
      }
    };

    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [weave]);

  useEffect(() => {
    if (!getSchemaIdFromHash(weave)) {
      setSchemaHash(activeSchemaId);
    }
  }, [activeSchemaId, weave]);

  const value = useMemo(() => {
    const activeSchema = weave.schemas[activeSchemaId];

    return {
      weave,
      activeSchemaId,
      activeSchema,
      schemaIds: Object.keys(weave.schemas),
      setActiveSchema,
    };
  }, [weave, activeSchemaId, setActiveSchema]);

  return <WeaveContext.Provider value={value}>{children}</WeaveContext.Provider>;
}

export function useWeave() {
  const context = useContext(WeaveContext);

  if (!context) {
    throw new Error("[Weavo] useWeave must be used within a WeaveProvider");
  }

  return context;
}

export default WeaveContext;
