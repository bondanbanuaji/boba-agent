import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import dotenv from "dotenv";

dotenv.config();

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: process.env.FRONTEND_URL || "*",
});
server.register(helmet);
server.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});
server.register(fastifyCookie);
server.register(fastifyMultipart);

import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import agentRoutes from "./routes/agent";
import integrationsRoutes from "./routes/integrations";
import whatsappRoutes from "./routes/integrations/whatsapp";
import webhookRoutes from "./routes/webhooks/telegram";

// Register Functional Routes
server.register(authRoutes, { prefix: "/api/auth" });
server.register(chatRoutes, { prefix: "/api/chat" });
server.register(agentRoutes, { prefix: "/api/agent" });
server.register(integrationsRoutes, { prefix: "/api/integrations" });
server.register(whatsappRoutes, { prefix: "/api/integrations" });
server.register(webhookRoutes, { prefix: "/api/webhooks" });

server.get("/health", async (request, reply) => {
  return { status: "ok", service: "BOBA-AGENT API" };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3001");
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
