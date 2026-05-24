import "./config/env.js";
import { db } from "./db/index.js";
import { users, agentMemory } from "./db/schema.js";
import { eq } from "drizzle-orm";

async function main() {
  try {
    const allUsers = await db.select().from(users);
    console.log("Found users in DB:", allUsers);
    
    if (allUsers.length === 0) {
      console.log("No users found in database yet. Waiting for sync.");
      return;
    }

    for (const u of allUsers) {
      const existing = await db.select()
        .from(agentMemory)
        .where(eq(agentMemory.userId, u.id));
      
      const hasNameMemory = existing.some(m => m.content.toLowerCase().includes("christa"));

      if (!hasNameMemory) {
        await db.insert(agentMemory).values({
          userId: u.id,
          memoryType: "fact",
          content: "Nama pengguna adalah Christa. Ini adalah ingatan jangka panjang penting yang harus selalu diingat di setiap obrolan.",
          importanceScore: 1.0,
        });
        console.log(`Saved long-term name memory for user ${u.email}`);
      } else {
        console.log(`User ${u.email} already has Christa name memory`);
      }
    }
  } catch (error) {
    console.error("Error in scratch_memory:", error);
  } finally {
    process.exit(0);
  }
}

main();
