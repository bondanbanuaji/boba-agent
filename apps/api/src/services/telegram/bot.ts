import "../../config/env.js";
import { Telegraf } from "telegraf";

const botToken = process.env.TELEGRAM_BOT_TOKEN;

// Initialize Telegraf bot if token is present
export const tgBot = botToken ? new Telegraf(botToken) : null;

export const startTelegramBot = async (useWebhook = false, webhookUrl = "") => {
  if (!tgBot) {
    console.warn("TELEGRAM_BOT_TOKEN not provided, skipping Telegram bot start");
    return;
  }

  // Basic Commands
  tgBot.start((ctx) => ctx.reply("Welcome to BOBA AGENT Telegram Bot! Type /help for options."));
  tgBot.help((ctx) => ctx.reply("Send me any message, and the AI agent will process it."));

  // Handle Text Messages
  tgBot.on("text", async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;
    const messageId = ctx.message.message_id;
    const chatId = ctx.chat.id;

    console.log(`[Telegram] Received message from ${userId} in chat ${chatId}: ${text}`);
    
    // Notify user we are processing
    await ctx.sendChatAction("typing");
    
    // Simulate routing to Orchestrator
    try {
      // In full implementation, we'd do: const response = await orchestrator.handleMessage(...)
      // For now, functional echo showing we received it.
      await ctx.reply(`Agent is processing: "${text}"`, {
        reply_parameters: { message_id: messageId }
      });
    } catch (error) {
      console.error("[Telegram] Error processing message:", error);
      await ctx.reply("Sorry, I encountered an error processing your request.");
    }
  });

  // Start the bot
  if (useWebhook && webhookUrl) {
    await tgBot.telegram.setWebhook(`${webhookUrl}/api/webhooks/telegram`);
    console.log(`[Telegram] Webhook set to ${webhookUrl}/api/webhooks/telegram`);
  } else {
    // Start in long-polling mode if no webhook
    tgBot.launch();
    console.log("[Telegram] Bot started in long-polling mode");
  }

  // Enable graceful stop
  process.once("SIGINT", () => tgBot.stop("SIGINT"));
  process.once("SIGTERM", () => tgBot.stop("SIGTERM"));
};

// Tool Methods for Agent
export const sendTelegramMessage = async (chatId: string | number, message: string) => {
  if (!tgBot) throw new Error("Telegram bot is not initialized");
  return await tgBot.telegram.sendMessage(chatId, message);
};

export const sendTelegramDocument = async (chatId: string | number, documentUrlOrPath: string, caption?: string) => {
  if (!tgBot) throw new Error("Telegram bot is not initialized");
  return await tgBot.telegram.sendDocument(chatId, documentUrlOrPath, { caption });
};
