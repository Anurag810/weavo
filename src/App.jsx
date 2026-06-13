import { WeaveProvider, SchemaRenderer, resolveWeave } from "./weave";
import { ThemeProvider } from "./theme-system";
import appWeave from "./builder/mock-schemas/app.weave.json";
import "./scss-core/app.scss";

const weave = resolveWeave(appWeave);

const App = () => {
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
