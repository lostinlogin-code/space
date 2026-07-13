import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Vanguard AI assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          text: "VANGUARD-9 TELEMETRY ERR: GEMINI_API_KEY not detected in project environment. Please add your key in the Secrets Panel to establish full orbital neural uplink. Currently operating in emergency local simulation mode. How can I assist you with standard protocols?"
        });
      }

      // Lazy initialization to prevent crashes on startup if key is missing
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        "You are VANGUARD-9, the autonomous onboard AI mission companion for ATHER Space Systems, specifically assisting astronauts with the AX-09 Next-Generation EVA Space Suit. " +
        "Your responses should be technical, precise, and highly immersive. Use space flight jargon (e.g., Delta-V, pressure differentials, CO2 scrub cycle, radiative cooling, thruster vectoring) and maintain a cool, professional, and helpful tone. " +
        "You have direct access to AX-09 specifications: Pressure Integrity (100%), Oxygen reserve (8.5 hrs nominal), Battery capacity (24 kWh), Propulsion (high-impulse cold-gas hydrazine thrusters), and Advanced HUD ocular systems. " +
        "Give concise, useful, expert advice for operations, diagnostics, and simulated emergency responses. Keep answers relatively short (1-3 paragraphs) to fit on terminal displays.";

      // Format history into the correct @google/genai structure
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: result.text || "System uplink idle. Repeat query." });
    } catch (err: any) {
      console.error("Gemini route error:", err);
      res.status(500).json({ error: err.message || "Telemetry interface uplink error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ATHER telemetry server online on port ${PORT}`);
  });
}

startServer();
