import { Router, Request, Response } from "express";
import { z } from "zod";
import { openaiClient, DEFAULT_MODEL } from "../services/openai/client.js";

const router = Router();

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
  model: z.string().optional(),
});

// Regular chat completion
router.post("/send", async (req: Request, res: Response) => {
  try {
    const { messages, model } = chatSchema.parse(req.body);

    const completion = await openaiClient.chat.completions.create({
      model: model || DEFAULT_MODEL,
      messages,
    });

    res.json({
      status: "success",
      data: completion.choices[0]?.message || { role: "assistant", content: "No response" },
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Chat request failed" });
  }
});

// Streaming chat completion (SSE)
router.post("/stream", async (req: Request, res: Response) => {
  try {
    const { messages, model } = chatSchema.parse(req.body);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await openaiClient.chat.completions.create({
      model: model || DEFAULT_MODEL,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Stream error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Chat history (placeholder)
router.get("/history/:conversationId", async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  res.json({
    status: "success",
    data: [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi! I am BOBA AGENT." },
    ],
  });
});

export default router;
