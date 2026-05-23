import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const agentTools: FunctionDeclaration[] = [
  {
    name: "gdrive_search_files",
    description: "Search for files in Google Drive",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: "The search query",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "gmail_send_email",
    description: "Send an email via Gmail",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        to: { type: SchemaType.STRING, description: "Recipient email address" },
        subject: { type: SchemaType.STRING, description: "Email subject" },
        body: { type: SchemaType.STRING, description: "Email body content" },
      },
      required: ["to", "subject", "body"],
    },
  },
  {
    name: "tg_send_message",
    description: "Send a message via Telegram",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        chat_id: { type: SchemaType.STRING, description: "Telegram chat ID or username" },
        message: { type: SchemaType.STRING, description: "Message content" },
      },
      required: ["chat_id", "message"],
    },
  },
  // Add other tools here...
];
