import "../../config/env.js";
import OpenAI from "openai";

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
  baseURL: process.env.OPENAI_BASE_URL || "http://localhost:20128/v1",
});

// A robust public OpenRouter client fallback directly in case the local proxy is offline
export const publicOpenAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
  baseURL: "https://openrouter.ai/api/v1",
});

export const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "meta-llama/llama-3.3-70b-instruct";
