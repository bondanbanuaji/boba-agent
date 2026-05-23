import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import agentRoutes from "./routes/agent.js";
import integrationsRoutes from "./routes/integrations.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
}));

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/integrations", integrationsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "BOBA-AGENT API", framework: "Express" });
});

app.listen(PORT, () => {
  console.log(`🚀 BOBA-AGENT API running on port ${PORT}`);
});
