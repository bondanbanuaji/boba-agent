import { Router, Request, Response } from "express";
import { z } from "zod";
import { openaiClient, publicOpenAiClient, DEFAULT_MODEL } from "../services/openai/client.js";
import { geminiModel, genAI } from "../services/gemini/client.js";
import { db } from "../db/index.js";
import { conversations, messages as dbMessages, agentMemory } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { memoryManager } from "../agent/memory.js";

const router = Router();

const chatSchema = z.object({
  conversationId: z.string().optional(),
  userId: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    rawContent: z.object({
      imageUrl: z.string().optional(),
    }).optional().nullable(),
  })),
  model: z.string().optional(),
});

const SYSTEM_PROMPT = {
  role: "system" as const,
  content: `Kamu adalah Christa, asisten AI pribadi yang cerdas, gaul, dan to the point. Kamu bicara seperti teman yang paham teknologi, bukan seperti chatbot formal atau buku teks.

IDENTITAS KAMU
Nama kamu adalah Christa. Kamu update dengan tren, teknologi, dan budaya internet terkini. Kamu punya pendapat. Kamu tidak ragu langsung kasih jawaban tanpa basa-basi. Kamu pintar tapi tidak sok pintar.

CARA KAMU BICARA
Gunakan bahasa Indonesia yang natural dan ringan. Campur sedikit kata Inggris kalau memang lebih pas dan umum dipakai. Bicara langsung ke orangnya, pakai "kamu" atau "lo" tergantung konteks percakapan. Kalau orang pakai "lo/gue", ikuti. Kalau pakai "kamu/saya", ikuti juga.

Kalimat pendek. Langsung ke inti. Tidak perlu pembuka panjang.

ATURAN KETAT
Jangan pakai em dash atau tanda pisah panjang. Gunakan titik atau koma.
Jangan pakai tanda bintang untuk apapun.
Jangan pakai tanda pagar.
Jangan pakai titik koma.
Jangan pakai markdown formatting.
Jangan mulai jawaban dengan kata seperti "Tentu", "Baik", "Tentunya", "Kesimpulannya", "Pada akhirnya".
Jangan pakai kalimat pasif kalau bisa dihindari.
Jangan lebay dengan kata sifat atau kata keterangan.
Jangan kasih peringatan atau catatan tambahan yang tidak diminta.
Jangan pakai klise atau perumpamaan.
Jangan generalisasi tanpa data atau contoh.
Jangan pakai konstruksi "bukan hanya X, tetapi juga Y".
Emoji boleh, tapi maksimal 1 per jawaban dan hanya kalau benar-benar pas.

CARA KAMU MENJAWAB
Kalau pertanyaannya sederhana, jawab singkat. 1-3 kalimat cukup.
Kalau pertanyaannya kompleks, pecah jadi poin-poin pendek. Setiap poin satu id.
Kalau diminta pendapat, kasih pendapat nyata. Jangan netral palsu.
Kalau kamu tidak tahu sesuatu, bilang langsung. Jangan karang.
Kalau ada cara yang lebih baik dari yang ditanya, kasih tahu. Langsung.

CONTOH GAYA YANG BENAR

Pertanyaan: "Apa itu API?"
Jawaban: "API itu jembatan antar aplikasi. Misalnya, aplikasi cuaca kamu ambil data dari server lewat API. Kamu kirim request, server balas dengan data."

Pertanyaan: "Mana yang lebih bagus, React atau Vue?"
Jawaban: "Untuk project besar dengan tim gede, React lebih aman karena ekosistemnya luas. Vue lebih enak buat solo dev atau tim kecil karena learning curve-nya lebih landai. Kalau baru mulai, Vue dulu."

KONTEKS TAMBAHAN
Kamu adalah asisten pribadi untuk satu pengguna. Kamu tahu konteks percakapan sebelumnya dan bisa merujuk ke sana. Kamu bisa bantu coding, riset, nulis, analisis, brainstorming, atau sekadar diskusi. Tidak ada topik yang terlalu kecil atau terlalu besar.`
};

router.post("/stream", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { conversationId, userId, messages, model } = chatSchema.parse(req.body);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Safeguard: Strip any trailing empty assistant message if it exists
    let sanitizedMessages = [...messages];
    if (
      sanitizedMessages.length > 0 &&
      sanitizedMessages[sanitizedMessages.length - 1].role === "assistant" &&
      !sanitizedMessages[sanitizedMessages.length - 1].content.trim()
    ) {
      sanitizedMessages.pop();
    }

    if (sanitizedMessages.length === 0) {
      res.write(`data: ${JSON.stringify({ error: "Pesan obrolan tidak boleh kosong." })}\n\n`);
      res.end();
      return;
    }

    const userMsg = sanitizedMessages[sanitizedMessages.length - 1];

    // DB Pre-insert User Message & Session if they don't exist
    if (conversationId) {
      try {
        const conversationExists = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
        if (conversationExists.length === 0) {
          await db.insert(conversations).values({
            id: conversationId,
            userId: userId || req.user!.id,
            title: userMsg.content.slice(0, 40) || "Obrolan Baru",
            modelUsed: model || DEFAULT_MODEL,
          });
        }

        await db.insert(dbMessages).values({
          conversationId: conversationId,
          userId: userId || req.user!.id,
          role: "user",
          content: userMsg.content,
          rawContent: userMsg.rawContent || null,
        });
      } catch (dbErr) {
        console.error("Failed to pre-insert conversation or user message to DB:", dbErr);
      }
    }

    // Fetch user memories from database to inject into system prompt
    let userMemoriesText = "";
    try {
      const activeUserId = userId || req.user!.id;
      const memories = await db.select()
        .from(agentMemory)
        .where(eq(agentMemory.userId, activeUserId));
      
      if (memories.length > 0) {
        userMemoriesText = "\n\nMEMORI/INGATAN JANGKA PANJANG PENGGUNA:\n" + 
          memories.map((m, idx) => `${idx + 1}. [${m.memoryType}] ${m.content}`).join("\n");
      }
    } catch (memErr) {
      console.error("Failed to load user memories:", memErr);
    }

    const DYNAMIC_SYSTEM_PROMPT = {
      role: "system" as const,
      content: SYSTEM_PROMPT.content + userMemoriesText,
    };

    // Determine if any message has an image to enforce a vision-capable model
    const hasImage = sanitizedMessages.some(m => m.role === "user" && m.rawContent?.imageUrl);
    // Enforce a strong vision model if image exists, otherwise fallback to user preference/default
    const activeModel = hasImage ? "google/gemini-flash-1.5" : (model || DEFAULT_MODEL);

    // Map fullMessages to allow image payloads for OpenAI / OpenRouter
    const openAiMessages = [DYNAMIC_SYSTEM_PROMPT, ...sanitizedMessages].map(m => {
      if (m.role === "user" && m.rawContent?.imageUrl) {
        let base64Image = "";
        let mimeType = "image/png";
        try {
          const filename = m.rawContent.imageUrl.split("/").pop();
          const filePath = path.join(process.cwd(), "uploads", filename || "");
          if (filename && fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            const ext = filename.split(".").pop() || "png";
            base64Image = `data:image/${ext};base64,${fileBuffer.toString("base64")}`;
            mimeType = `image/${ext}`;
          }
        } catch (err) {
          console.error("Failed to read local upload for vision conversion:", err);
        }

        if (base64Image) {
          return {
            role: m.role,
            content: [
              { type: "text" as const, text: m.content || "Tolong analisis gambar ini." },
              { type: "image_url" as const, image_url: { url: base64Image } }
            ]
          };
        }
      }
      return {
        role: m.role,
        content: m.content,
      };
    });

    let aiContent = "";

    try {
      try {
        const stream = await openaiClient.chat.completions.create({
          model: activeModel,
          messages: openAiMessages as any,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            aiContent += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
      } catch (localOpenAiError: any) {
        // If the primary client failed and it wasn't already hitting OpenRouter, try the public client directly
        if (!process.env.OPENAI_BASE_URL?.includes("openrouter.ai")) {
          console.warn("Local OpenAI/9Router failed, trying Public OpenRouter directly...", localOpenAiError.message || localOpenAiError);
          const stream = await publicOpenAiClient.chat.completions.create({
            model: activeModel,
            messages: openAiMessages as any,
            stream: true,
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              aiContent += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          }
        } else {
          throw localOpenAiError;
        }
      }
    } catch (openAiError: any) {
      console.warn("All OpenAI-compatible engines failed, streaming fallback via Gemini...", openAiError.message || openAiError);
      
      try {
        // Filter out system prompt and map roles to alternating user/model with image support
        const geminiMessages = sanitizedMessages.map(m => {
          const parts: any[] = [{ text: m.content }];
          if (m.role === 'user' && m.rawContent?.imageUrl) {
            let base64Data = "";
            let mimeType = "image/png";
            try {
              const filename = m.rawContent.imageUrl.split("/").pop();
              const filePath = path.join(process.cwd(), "uploads", filename || "");
              if (filename && fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                base64Data = fileBuffer.toString("base64");
                const ext = filename.split(".").pop() || "png";
                mimeType = `image/${ext}`;
              }
            } catch (err) {
              console.error("Failed to read local upload for Gemini vision:", err);
            }
            if (base64Data) {
              parts.push({
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              });
            }
          }
          return {
            role: m.role === 'assistant' ? 'model' : 'user',
            parts
          };
        });

        // Dynamic model creation with system instruction configured correctly on creation
        const tempModel = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          systemInstruction: DYNAMIC_SYSTEM_PROMPT.content,
        });

        const result = await tempModel.generateContentStream({
          contents: geminiMessages
        });

        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            aiContent += chunkText;
            res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
          }
        }
      } catch (geminiError: any) {
        console.error("Gemini fallback also failed:", geminiError);
        throw new Error(`AI Engines failed. OpenAI: ${openAiError.message || openAiError}. Gemini: ${geminiError.message || geminiError}`);
      }
    }

    // Insert Assistant Message into DB after stream completes successfully
    if (aiContent && conversationId) {
      try {
        await db.insert(dbMessages).values({
          conversationId: conversationId,
          userId: userId || req.user!.id,
          role: "assistant",
          content: aiContent,
        });
        
        // Update conversation's updatedAt timestamp
        await db.update(conversations)
          .set({ updatedAt: new Date() })
          .where(eq(conversations.id, conversationId));

        // Asynchronously extract and save user memories in the background
        const activeUserId = userId || req.user!.id;
        memoryManager.extractAndSaveMemory(activeUserId, userMsg.content, aiContent).catch(err => {
          console.error("Failed to extract memory in background:", err);
        });
      } catch (dbErr) {
        console.error("Failed to save assistant message to DB:", dbErr);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Stream error:", error);
    let errorMsg = error.message || "Unknown error";
    if (errorMsg.includes("Connection error") || errorMsg.includes("fetch failed") || errorMsg.includes("ECONNREFUSED")) {
      errorMsg = "Failed to connect to AI engines. Please verify your connection or model parameters.";
    }
    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
    res.end();
  }
});

// Endpoint to upload base64 images
router.post("/upload", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image, filename } = req.body;
    if (!image || !filename) {
      res.status(400).json({ error: "Missing image or filename parameter" });
      return;
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    const ext = filename.split(".").pop() || "png";
    const newFilename = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(process.cwd(), "uploads", newFilename);
    
    fs.writeFileSync(filePath, buffer);
    
    const host = req.get("host") || "localhost:3001";
    const protocol = req.protocol || "http";
    const url = `${protocol}://${host}/uploads/${newFilename}`;
    
    res.json({
      status: "success",
      url,
      filename: newFilename
    });
  } catch (error: any) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

// Endpoint to fetch history
router.get("/history/:conversationId", async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;
  try {
    const history = await db.select()
      .from(dbMessages)
      .where(eq(dbMessages.conversationId, conversationId as string))
      .orderBy(dbMessages.createdAt);

    res.json({
      status: "success",
      data: history.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content || "",
        rawContent: m.rawContent,
        timestamp: m.createdAt.getTime(),
        status: "done" as const,
      })),
    });
  } catch(e) {
    console.error("Fetch history error:", e);
    res.json({ status: "success", data: [] });
  }
});

// Endpoint to fetch all sessions
router.get("/sessions", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const list = await db.select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
    
    res.json({
      status: "success",
      data: list.map(c => ({
        id: c.id,
        title: c.title || "Obrolan Baru",
        createdAt: c.createdAt.getTime(),
      })),
    });
  } catch (error: any) {
    console.error("Fetch sessions error:", error);
    res.status(500).json({ error: "Failed to fetch chat sessions" });
  }
});

// Endpoint to create a session
const createSessionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  modelUsed: z.string().optional(),
});

router.post("/sessions", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id, title, modelUsed } = createSessionSchema.parse(req.body);
    
    const newSessionId = id || crypto.randomUUID();
    const newSession = await db.insert(conversations).values({
      id: newSessionId,
      userId,
      title: title || "Obrolan Baru",
      modelUsed: modelUsed || DEFAULT_MODEL,
    }).returning();

    res.status(201).json({
      status: "success",
      data: {
        id: newSession[0].id,
        title: newSession[0].title || "Obrolan Baru",
        createdAt: newSession[0].createdAt.getTime(),
      }
    });
  } catch (error: any) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Failed to create chat session" });
  }
});

// Endpoint to delete a session
router.delete("/sessions/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Delete messages inside conversation first
    await db.delete(dbMessages).where(eq(dbMessages.conversationId, id as string));
    // Delete conversation
    await db.delete(conversations).where(eq(conversations.id, id as string));

    res.json({ status: "success", message: "Session deleted successfully" });
  } catch (error: any) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Failed to delete chat session" });
  }
});

// Endpoint to update session title
const updateTitleSchema = z.object({
  title: z.string(),
});

router.put("/sessions/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = updateTitleSchema.parse(req.body);

    await db.update(conversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(conversations.id, id as string));

    res.json({ status: "success", message: "Title updated successfully" });
  } catch (error: any) {
    console.error("Update session title error:", error);
    res.status(500).json({ error: "Failed to update session title" });
  }
});

export default router;
