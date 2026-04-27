import ollama from "ollama";

class WeavoAI {
  constructor({ model = "qwen2.5-coder" } = {}) {
    this.model = model;
  }

  async chat(message) {
    try {
      console.log("Sending message to AI:", message);

      const response = await ollama.chat({
        model: this.model,
        messages: [{ role: "user", content: message }],
        keep_alive: "5m" // 🔥 keeps model loaded
      });

      return response;

    } catch (err) {
      console.error("AI Error:", err);
      return {
        role: "assistant",
        content: "AI failed",
        error: err.toString()
      };
    }
  }

  async chatStream(message, onToken) {
    try {
      const stream = await ollama.chat({
        model: this.model,
        messages: [{ role: "user", content: message }],
        stream: true,
        keep_alive: "5m"
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const token = chunk.message?.content || "";
        fullResponse += token;

        if (onToken) onToken(token); // send token to UI
      }

      return {
        role: "assistant",
        content: fullResponse
      };

    } catch (err) {
      console.error("Streaming Error:", err);
      return {
        role: "assistant",
        content: "AI streaming failed",
        error: err.toString()
      };
    }
  }

async checkModelStatus() {
    try {
      const res = await fetch("http://127.0.0.1:11434/api/tags");
      const data = await res.json();

      const exists = data.models.some(m => m.name.includes(this.model));

      console.log(exists ? "✅ Model ready" : "❌ Model not found");
      return exists;

    } catch (err) {
      console.log("❌ Ollama not running");
      return false;
    }
  }

  async startAIServer() {
    const { spawn } = await import("child_process");

    const aiProcess = spawn("ollama", ["serve"], {
      detached: true,
      stdio: "ignore"
    });

    aiProcess.unref();
    console.log("🚀 Ollama server started");
  }

  async checkOrPullModel() {
    const { exec } = await import("child_process");

    return new Promise((resolve, reject) => {
      console.log(`📦 Checking model: ${this.model}`);

      exec("ollama list", (err, stdout) => {
        if (err) {
          console.error("❌ Failed to list models", err);
          return reject(err);
        }

        if (stdout.includes(this.model.split(":")[0])) {
          console.log(`✅ Model already installed: ${this.model}`);
          return resolve(true);
        }

        console.log(`⬇️ Pulling model: ${this.model}...`);

        const pull = exec(`ollama pull ${this.model}`);

        pull.stdout.on("data", (data) => {
          process.stdout.write(data);
        });

        pull.stderr.on("data", (data) => {
          process.stderr.write(data);
        });

        pull.on("close", (code) => {
          if (code === 0) {
            console.log(`✅ Model installed`);
            resolve(true);
          } else {
            reject(new Error("Model pull failed"));
          }
        });
      });
    });
  }
}

export default WeavoAI;