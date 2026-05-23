import { FastifyInstance } from "fastify";
import { currentQR, isConnected, startWhatsAppClient } from "../../services/whatsapp/client";
import * as QRCode from "qrcode";

export default async function whatsappRoutes(fastify: FastifyInstance) {
  fastify.get("/whatsapp/qr", async (request, reply) => {
    if (isConnected) {
      return reply.code(200).send({ status: "connected", message: "WhatsApp is already connected." });
    }

    if (!currentQR) {
      // Trigger client start if not running yet
      startWhatsAppClient();
      return reply.code(202).send({ status: "initializing", message: "Generating QR code, please try again in a few seconds." });
    }

    try {
      // Generate base64 Data URL for the frontend to display
      const qrDataUrl = await QRCode.toDataURL(currentQR);
      return reply.code(200).send({ status: "pending", qr: qrDataUrl });
    } catch (error) {
      return reply.code(500).send({ error: "Failed to generate QR code image" });
    }
  });

  fastify.get("/whatsapp/status", async (request, reply) => {
    return reply.code(200).send({
      connected: isConnected,
      qrAvailable: !!currentQR && !isConnected
    });
  });
}
