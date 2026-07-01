import { useDataSource } from "./DataSourceProvider.jsx";

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
 * On a successful response the body is exposed as `data`, so component
 * properties can bind to it with {{ data.x }} (resolved in the live preview).
 */
export function DataSourcePanel() {
  const { request, updateRequest, send, result, error, loading } = useDataSource();
  const { url, method, body } = request;
  const hasBody = method === "POST" || method === "PUT";

  return (
    <section className="weavo-pg-data">
      <h3 className="weavo-pg-panel-title">Data Source</h3>

      <div className="weavo-pg-data-request">
        <div className="weavo-pg-data-row">
          <select
            className="weavo-pg-field-input weavo-pg-data-method"
            value={method}
            onChange={(e) => updateRequest({ method: e.target.value })}
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
            onChange={(e) => updateRequest({ url: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />

          <button
            type="button"
            className="weavo-btn weavo-btn-primary sm"
            onClick={send}
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
              onChange={(e) => updateRequest({ body: e.target.value })}
            />
          </label>
        )}
      </div>

      {error && <div className="weavo-pg-data-error">Request failed: {error}</div>}

      {result && (
        <div className="weavo-pg-data-response">
          <div className={`weavo-pg-data-status${result.ok ? " is-ok" : " is-fail"}`}>
            <span className="weavo-pg-data-status-code">
              {result.status} {result.statusText}
            </span>
            <span className="weavo-pg-data-status-time">{result.elapsed} ms</span>
          </div>

          {result.ok && (
            <p className="weavo-pg-data-hint">
              Bind these in component properties with{" "}
              <code>{"{{ data.message }}"}</code> or <code>{"{{ data.data.0.name }}"}</code>.
            </p>
          )}

          <pre className="weavo-pg-data-output">{formatResponse(result.body)}</pre>
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
