import { Worker } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.UPSTASH_REDIS_URL || "redis://localhost:6379");

export const agentTaskWorker = new Worker(
  "agent-tasks",
  async (job) => {
    console.log("Processing agent task:", job.id);
    // Execute task
  },
  { connection }
);

export const scheduledTaskWorker = new Worker(
  "scheduled-tasks",
  async (job) => {
    console.log("Processing scheduled task:", job.id);
    // Execute task
  },
  { connection }
);
