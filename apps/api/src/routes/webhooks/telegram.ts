import { FastifyInstance } from "fastify";
import { tgBot } from "../../services/telegram/bot";

export default async function webhookRoutes(fastify: FastifyInstance) {
  // Telegram Webhook
  fastify.post("/telegram", async (request, reply) => {
    if (!tgBot) {
      return reply.code(503).send({ error: "Telegram bot not initialized" });
    }

    try {
      // Pass the update to Telegraf manually
      await tgBot.handleUpdate(request.body as any, reply.raw);
      // Fastify reply is handled natively by Telegraf's reply.raw wrapper above 
      // but just in case, we return success if it doesn't close the stream
      if (!reply.sent) {
         return reply.code(200).send({ status: "ok" });
      }
    } catch (error) {
      console.error("[Webhook] Telegram error:", error);
      if (!reply.sent) {
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  });
}
