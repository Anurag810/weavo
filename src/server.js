import express from "express";
import cors from "cors";
import {
  getAllWeaves,
  getWeaveById,
  getResolvedWeave,
  getSchemaByFilename,
  saveSchema,
} from "./server/weave-store.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/weavo.ping", (_req, res) => {
  res.status(200).send({ message: "pong" });
});

app.get("/api/weavo.get-all-weaves", async (_req, res) => {
  try {
    const weaves = await getAllWeaves();
    res.status(200).send({ message: "Weaves fetched successfully", data: weaves });
  } catch (error) {
    res.status(500).send({ message: "Error fetching weaves", error: error.message });
  }
});

/** Weave manifest only (no schema trees). */
app.get("/api/weavo.weave/:weaveId", async (req, res) => {
  try {
    const weave = await getWeaveById(req.params.weaveId);

    if (!weave) {
      return res.status(404).send({ message: "Weave not found" });
    }

    res.status(200).send({ message: "Weave fetched successfully", data: weave });
  } catch (error) {
    res.status(500).send({ message: "Error fetching weave", error: error.message });
  }
});

/** Full weave with all schema trees — primary endpoint for the frontend. */
app.get("/api/weavo.weave/:weaveId/resolved", async (req, res) => {
  try {
    const weave = await getResolvedWeave(req.params.weaveId);

    if (!weave) {
      return res.status(404).send({ message: "Weave not found" });
    }

    res.status(200).send({ message: "Weave resolved successfully", data: weave });
  } catch (error) {
    res.status(500).send({ message: "Error resolving weave", error: error.message });
  }
});

/** Create or overwrite a schema in a weave (Playground save). */
app.post("/api/weavo.weave/:weaveId/schema", async (req, res) => {
  try {
    const { schemaId, title, schema } = req.body ?? {};

    const manifest = await getWeaveById(req.params.weaveId);
    if (!manifest) {
      return res.status(404).send({ message: "Weave not found" });
    }

    const data = await saveSchema(req.params.weaveId, { schemaId, title, schema });
    res.status(200).send({ message: "Schema saved successfully", data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/** Single schema tree by weave + schema id. */
app.get("/api/weavo.weave/:weaveId/schema/:schemaId", async (req, res) => {
  try {
    const { weaveId, schemaId } = req.params;
    const manifest = await getWeaveById(weaveId);

    if (!manifest) {
      return res.status(404).send({ message: "Weave not found" });
    }

    const schemaEntry = manifest.schemas[schemaId];

    if (!schemaEntry) {
      return res.status(404).send({ message: "Schema not found" });
    }

    const schema = await getSchemaByFilename(schemaEntry.file);

    res.status(200).send({
      message: "Schema fetched successfully",
      data: schema,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching schema", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
