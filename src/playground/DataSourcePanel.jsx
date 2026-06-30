import { useState } from "react";

const METHODS = ["GET", "POST", "PUT", "DELETE"];

function formatResponse(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * Data Source panel — enter a URL, fire a request, and inspect the response.
 * Useful for testing the endpoints a schema will eventually bind to.
 */
export function DataSourcePanel() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const hasBody = method === "POST" || method === "PUT";

  const fetchData = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const started = performance.now();

    try {
      const options = { method, headers: {} };

      if (hasBody && body.trim()) {
        options.headers["Content-Type"] = "application/json";
        options.body = body.trim();
      }

      const response = await fetch(trimmed, options);
      const elapsed = Math.round(performance.now() - started);

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      setResult({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        elapsed,
        data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="weavo-pg-data">
      <h3 className="weavo-pg-panel-title">Data Source</h3>

      <div className="weavo-pg-data-request">
        <div className="weavo-pg-data-row">
          <select
            className="weavo-pg-field-input weavo-pg-data-method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            aria-label="HTTP method"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            className="weavo-pg-field-input weavo-pg-data-url"
            type="url"
            placeholder="https://api.example.com/data"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchData();
            }}
          />

          <button
            type="button"
            className="weavo-btn weavo-btn-primary sm"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>

        {hasBody && (
          <label className="weavo-pg-field">
            <span className="weavo-pg-field-label">Request body (JSON)</span>
            <textarea
              className="weavo-pg-field-input weavo-pg-field-textarea"
              rows={4}
              spellCheck={false}
              placeholder='{ "key": "value" }'
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
        )}
      </div>

      {error && <div className="weavo-pg-data-error">Request failed: {error}</div>}

      {result && (
        <div className="weavo-pg-data-response">
          <div
            className={`weavo-pg-data-status${result.ok ? " is-ok" : " is-fail"}`}
          >
            <span className="weavo-pg-data-status-code">
              {result.status} {result.statusText}
            </span>
            <span className="weavo-pg-data-status-time">{result.elapsed} ms</span>
          </div>
          <pre className="weavo-pg-data-output">{formatResponse(result.data)}</pre>
        </div>
      )}

      {!result && !error && !loading && (
        <p className="weavo-pg-data-empty">
          Enter a URL and send a request to inspect the response.
        </p>
      )}
    </section>
  );
}

export default DataSourcePanel;
