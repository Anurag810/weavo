import { renderNode } from "./schema-renderer/renderer";
import demoSchema from "./builder/mock-schemas/demo.schema.json";
import "./scss-core/app.scss";

const App = () => {
  return <div className="App weavo-app">{renderNode(demoSchema)}</div>;
};

export default App;
