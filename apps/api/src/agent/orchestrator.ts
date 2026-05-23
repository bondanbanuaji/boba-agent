import { geminiModel } from "../services/gemini/client";

export class AgentOrchestrator {
  constructor() {}

  async handleMessage(message: string, userId: string) {
    // Skeleton implementation
    return `Processed message: ${message}`;
  }
}

export const orchestrator = new AgentOrchestrator();
