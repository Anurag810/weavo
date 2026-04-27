import express from "express";
import cors from "cors";
import WeavoAI from "./schema-renderer/ai-models/ai-wrapper.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/api/ping", (req, res) => {
	res.send("pong");
});

app.get("/api/ai", async (req, res) => {
  console.log("Received request to /api/ai", req.query);
  let client_message = req.query.message || "Hello, WeavoAI!";
  let weavo_ai = new WeavoAI();

	try {
  		const isRunning = await weavo_ai.checkModelStatus();
		if (!isRunning) {
			await weavo_ai.startAIServer();

			await new Promise(r => setTimeout(r, 2000));
		}

		await weavo_ai.checkOrPullModel();

		const response = await weavo_ai.chat(client_message);

		res.send({
			message: client_message,
			ai_response: response.message.content
		});
	} catch (err) {
		console.error("Model status check failed:", err);
		return res.status(500).send({ error: "Model status check failed", details: err.toString() });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port https//localhost:${port}`);
});
