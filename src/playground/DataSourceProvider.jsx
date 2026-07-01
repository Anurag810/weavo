import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DataSourceContext = createContext(null);

const initialRequest = { url: "", method: "GET", body: "" };

/**
 * Holds the playground's data-source request + last successful response so the
 * Data panel state survives tab switches and the response (`data`) is available
 * to the live preview for {{ data.x }} bindings.
 */
export function DataSourceProvider({ children }) {
  const [request, setRequest] = useState(initialRequest);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateRequest = useCallback((patch) => {
    setRequest((prev) => ({ ...prev, ...patch }));
  }, []);

  const send = useCallback(async () => {
    const url = request.url.trim();
    if (!url) {
      setError("Enter a URL first.");
      return;
    }

    setLoading(true);
    setError(null);

    const started = performance.now();
    const hasBody = request.method === "POST" || request.method === "PUT";

    try {
      const options = { method: request.method, headers: {} };

      if (hasBody && request.body.trim()) {
        options.headers["Content-Type"] = "application/json";
        options.body = request.body.trim();
      }

      const response = await fetch(url, options);
      const elapsed = Math.round(performance.now() - started);
      const contentType = response.headers.get("content-type") ?? "";
      const body = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      setResult({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        elapsed,
        body,
      });
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      request,
      updateRequest,
      send,
      clear,
      result,
      error,
      loading,
      // The parsed response body, exposed as `data` for {{ data.* }} bindings.
      data: result?.ok ? result.body : undefined,
    }),
    [request, updateRequest, send, clear, result, error, loading]
  );

  return <DataSourceContext.Provider value={value}>{children}</DataSourceContext.Provider>;
}

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error("[Weavo] useDataSource must be used within a DataSourceProvider");
  }
  return context;
}

export default DataSourceContext;
