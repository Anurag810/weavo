import { WeaveProvider, SchemaRenderer, fetchWeave } from "./weave";
import { ThemeProvider } from "./theme-system";
import "./scss-core/app.scss";
import { useEffect, useState } from "react";

/** Default weave id — must match `id` in app.weave.json and server weave-store. */
const DEFAULT_WEAVE_ID = "app";

const App = () => {
  const [weave, setWeave] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeave(DEFAULT_WEAVE_ID)
      .then(setWeave)
      .catch((err) => {
        console.error("[Weavo] Failed to load weave from API:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <ThemeProvider defaultTheme="light">
        <div className="App weavo-app">
          <p>Could not load weave. Is the API running?</p>
          <p>
            <code>npm run serve</code>
          </p>
          <pre>{error}</pre>
        </div>
      </ThemeProvider>
    );
  }

  if (!weave) {
    return (
      <ThemeProvider defaultTheme="light">
        <div className="App weavo-app">Loading weave…</div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <WeaveProvider weave={weave}>
        <div className="App weavo-app">
          <SchemaRenderer />
        </div>
      </WeaveProvider>
    </ThemeProvider>
  );
};

export default App;
