import { agentMemory } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { openaiClient, publicOpenAiClient, DEFAULT_MODEL } from "../services/openai/client.js";
import { genAI } from "../services/gemini/client.js";

export class AgentMemoryManager {
  async saveMemory(userId: string, content: string, type: "fact" | "preference" | "context" | "goal") {
    console.log(`Saving memory for ${userId}: [${type}] ${content}`);
    try {
      await db.insert(agentMemory).values({
        userId,
        memoryType: type,
        content,
        importanceScore: 1.0,
      });
    } catch (err) {
      console.error("Failed to save memory to DB:", err);
    }
  }

  async queryMemory(userId: string, query: string) {
    // Basic search of all user memories
    try {
      const memories = await db.select()
        .from(agentMemory)
        .where(eq(agentMemory.userId, userId));
      return memories;
    } catch (err) {
      console.error("Failed to query memories:", err);
      return [];
    }
  }

  async extractAndSaveMemory(userId: string, userMessage: string, assistantMessage: string) {
    console.log(`[MemoryManager] Triggered background memory extraction for user ${userId}...`);
    
    const prompt = `Kamu adalah Christa Memory Extractor. Tugas kamu adalah mengekstrak informasi penting, fakta jangka panjang, atau preferensi spesifik tentang PENGGUNA (user) dari percakapan singkat berikut.

Percakapan:
User: "${userMessage}"
Assistant (Christa): "${assistantMessage}"

Tugas:
Ekstrak informasi penting/fakta baru tentang PENGGUNA yang berguna untuk diingat selamanya agar asisten bisa memberikan layanan yang dipersonalisasi di masa mendatang.
Contoh fakta pengguna yang perlu diingat:
- Nama pengguna (misalnya: "Pengguna bernama John")
- Pekerjaan atau keahlian pengguna (misalnya: "Pengguna bekerja sebagai desainer grafis")
- Preferensi atau favorit (misalnya: "Pengguna lebih menyukai warna gelap", "Pengguna suka kopi hitam tanpa gula")
- Informasi relevan lainnya tentang kondisi/situasi pengguna.

Aturan Penting:
1. JANGAN mengekstrak informasi tentang asisten/agent (diri kamu sendiri). Misalnya, JANGAN membuat memori seperti "Nama asisten adalah Christa" atau "Asisten pintar coding". Asisten selalu bernama Christa, itu sudah bawaan sistem, tidak perlu disimpan di memori pengguna.
2. Ingat bahwa Christa adalah asisten/agent, bukan pengguna. Jadi pastikan memori yang disimpan adalah tentang PENGGUNA (user), bukan asisten.
3. Hanya ekstrak fakta baru yang secara eksplisit dinyatakan oleh pengguna atau disepakati dalam percakapan. Jangan berasumsi berlebihan.
4. Output WAJIB dalam bentuk JSON array berisi objek-objek memory. Setiap objek memiliki format:
{
  "content": "fakta murni tentang pengguna dalam bahasa Indonesia yang ringkas",
  "memoryType": "fact" atau "preference"
}
Jika tidak ada informasi penting atau fakta baru tentang pengguna yang layak diingat dari percakapan ini, kembalikan array kosong: []

Kembalikan HANYA JSON array tersebut, tanpa markdown block (seperti \`\`\`json) atau teks pengantar lainnya.`;

    let responseText = "";

    try {
      // 1. Try local OpenAI proxy first
      const response = await openaiClient.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      });
      responseText = response.choices[0]?.message?.content || "";
    } catch (localOpenaiErr) {
      console.warn("[MemoryManager] Local OpenAI proxy failed. Hitting public OpenRouter fallback directly...", localOpenaiErr);
      try {
        // 2. Try public OpenRouter API directly
        const response = await publicOpenAiClient.chat.completions.create({
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        });
        responseText = response.choices[0]?.message?.content || "";
      } catch (publicOpenaiErr) {
        console.warn("[MemoryManager] Public OpenRouter extraction also failed, falling back to Gemini...", publicOpenaiErr);
        try {
          // 3. Fallback to Gemini
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(prompt);
          responseText = result.response.text();
        } catch (geminiErr) {
          console.error("[MemoryManager] Gemini memory extraction fallback also failed:", geminiErr);
          return;
        }
      }
    }

    if (!responseText.trim()) {
      console.log("[MemoryManager] Empty response received from extractor.");
      return;
    }

    try {
      // Clean potential markdown blocks
      let jsonText = responseText.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const extractedMemories = JSON.parse(jsonText);
      if (!Array.isArray(extractedMemories)) {
        console.warn("[MemoryManager] Parsed output is not an array:", extractedMemories);
        return;
      }

      if (extractedMemories.length === 0) {
        console.log("[MemoryManager] No new memories extracted.");
        return;
      }

      // Fetch existing memories to avoid duplicates
      const existing = await db.select()
        .from(agentMemory)
        .where(eq(agentMemory.userId, userId));

      for (const mem of extractedMemories) {
        if (!mem.content || !mem.memoryType) continue;

        // Skip any extracted memory that mentions the agent's name Christa in a confusing way
        const lowerContent = mem.content.toLowerCase();
        if (
          lowerContent.includes("asisten bernama christa") || 
          lowerContent.includes("agent bernama christa") ||
          lowerContent.includes("nama asisten") ||
          lowerContent.includes("nama agent")
        ) {
          console.log(`[MemoryManager] Skipped saving agent identity as user memory: ${mem.content}`);
          continue;
        }

        // Avoid exact duplicates
        const isDuplicate = existing.some(
          ex => ex.content.toLowerCase().trim() === mem.content.toLowerCase().trim()
        );

        if (!isDuplicate) {
          await db.insert(agentMemory).values({
            userId,
            memoryType: mem.memoryType as "fact" | "preference" | "context" | "goal",
            content: mem.content,
            importanceScore: 1.0,
          });
          console.log(`[MemoryManager] Saved new memory for user ${userId}: ${mem.content}`);
        } else {
          console.log(`[MemoryManager] Memory already exists, skipped: ${mem.content}`);
        }
      }
    } catch (parseErr) {
      console.error("[MemoryManager] Failed to parse or save extracted memories. Response text was:", responseText, parseErr);
    }
  }
}

export const memoryManager = new AgentMemoryManager();
