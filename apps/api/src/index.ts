import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import agentRoutes from "./routes/agent.js";
import integrationsRoutes from "./routes/integrations.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// DEBUG: Verify environment variable loading
console.log("--- Server Startup Debug ---");
console.log("SUPABASE_JWT_SECRET loaded:", process.env.SUPABASE_JWT_SECRET ? (process.env.SUPABASE_JWT_SECRET.substring(0, 5) + "...") : "NOT FOUND");
console.log("----------------------------");

import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: "20mb" }));
app.use("/uploads", express.static(uploadsDir));
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/agent", authMiddleware, agentRoutes);
app.use("/api/integrations", authMiddleware, integrationsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "BOBA-AGENT API", framework: "Express" });
});

app.listen(PORT, () => {
  console.log(`🚀 BOBA-AGENT API running on port ${PORT}`);
});
