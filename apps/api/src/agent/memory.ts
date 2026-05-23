import { agentMemory } from "../db/schema";

export class AgentMemoryManager {
  async saveMemory(userId: string, content: string, type: "fact" | "preference" | "context" | "goal") {
    console.log(`Saving memory for ${userId}: [${type}] ${content}`);
    // Insert into DB
  }

  async queryMemory(userId: string, query: string) {
    // Semantic search via pgvector
    return [];
  }
}

export const memoryManager = new AgentMemoryManager();
