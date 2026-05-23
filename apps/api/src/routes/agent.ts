import { FastifyInstance } from "fastify";
import { z } from "zod";

export default async function agentRoutes(fastify: FastifyInstance) {
  fastify.post("/execute", async (request, reply) => {
    const executeSchema = z.object({
      action: z.string(),
      params: z.any().optional(),
    });

    try {
      const { action, params } = executeSchema.parse(request.body);
      
      // Simulasi eksekusi aksi agen secara fungsional
      return reply.code(200).send({
        status: "success",
        action,
        result: `Executed action ${action} successfully.`,
      });
    } catch (error) {
      return reply.code(400).send({ error: "Invalid agent command format" });
    }
  });

  fastify.get("/status", async (request, reply) => {
    return reply.code(200).send({
      status: "idle",
      currentTask: null
    });
  });
}
