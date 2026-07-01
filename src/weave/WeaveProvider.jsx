import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSchemaIdFromHash, setSchemaHash } from "./hash-routing.js";

const WeaveContext = createContext(null);

export function WeaveProvider({ weave, children }) {
  const [activeSchemaId, setActiveSchemaIdState] = useState(() => {
    return getSchemaIdFromHash(weave) ?? weave.default;
  });

  const [modal, setModal] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});

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

  const login = useCallback((payload = {}) => {
    const username = payload.username?.trim();
    const password = payload.password;

    if (!username || !password) {
      window.alert("Please enter username and password.");
      return false;
    }

    // Demo credentials — replace with API auth in v0.3
    if (username !== "admin" || password !== "admin") {
      window.alert("Invalid username or password.");
      return false;
    }

    setIsLoggedIn(true);
    setUserDetails({ userID: username });
    setModal(null);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserDetails({});
  }, []);


  const showModal = useCallback((header, body, footer) => {
    setModal({ header, body, footer });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

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

  useEffect(() => {
    setModal(null);
  }, [activeSchemaId]);

  const value = useMemo(() => {
    const activeSchema = weave.schemas[activeSchemaId];

    return {
      weave,
      activeSchemaId,
      activeSchema,
      schemaIds: Object.keys(weave.schemas),
      setActiveSchema,
      showModal,
      closeModal,
      modal,
      isLoggedIn,
      userDetails,
      login,
      logout,
    };
  }, [weave, activeSchemaId, setActiveSchema, showModal, closeModal, modal, isLoggedIn, userDetails, login, logout]);

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
