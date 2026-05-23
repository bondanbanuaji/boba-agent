import { FastifyInstance } from "fastify";
import { getAuthUrl, getTokens } from "../services/google/auth";
import { z } from "zod";

export default async function integrationsRoutes(fastify: FastifyInstance) {
  fastify.get("/google/url", async (request, reply) => {
    try {
      const url = getAuthUrl();
      return reply.code(200).send({ url });
    } catch (error) {
      return reply.code(500).send({ error: "Failed to generate Google Auth URL" });
    }
  });

  fastify.post("/google/callback", async (request, reply) => {
    const callbackSchema = z.object({
      code: z.string(),
    });

    try {
      const { code } = callbackSchema.parse(request.body);
      const tokens = await getTokens(code);
      
      // Secara fungsional kita mengembalikan token
      return reply.code(200).send({ 
        message: "Google connected successfully",
        tokens
      });
    } catch (error) {
       return reply.code(400).send({ error: "Invalid callback data" });
    }
  });

  fastify.get("/status", async (request, reply) => {
    return reply.code(200).send({
      google: false,
      telegram: false,
      whatsapp: false
    });
  });
}
