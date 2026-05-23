import { FastifyInstance } from "fastify";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
  conversationId: z.string().uuid().optional(),
});

export default async function chatRoutes(fastify: FastifyInstance) {
  fastify.post("/send", async (request, reply) => {
    try {
      const parsed = messageSchema.parse(request.body);
      // Fungsional: Mengirim pesan kembali sebagai echo dasar untuk API
      return reply.code(200).send({
        status: "success",
        data: {
          content: `Echo: ${parsed.content}`,
          conversationId: parsed.conversationId || "new-conversation-id",
        }
      });
    } catch (error) {
      return reply.code(400).send({ error: "Invalid chat payload" });
    }
  });

  fastify.get("/history/:conversationId", async (request, reply) => {
    const { conversationId } = request.params as { conversationId: string };
    return reply.code(200).send({
      status: "success",
      data: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi! I am BOBA AGENT." }
      ]
    });
  });
}
