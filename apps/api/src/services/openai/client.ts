import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
  baseURL: process.env.OPENAI_BASE_URL || "http://localhost:20128/v1",
});

export const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "nvidia/meta/llama-3.3-70b-instruct";
