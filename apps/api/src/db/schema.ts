import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"),
  walletAddress: text("wallet_address"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  role: text("role").$type<"admin" | "user">().default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title"),
  modelUsed: text("model_used"),
  totalTokens: integer("total_tokens").default(0),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: text("role").$type<"user" | "assistant" | "tool" | "system">().notNull(),
  content: text("content"),
  rawContent: jsonb("raw_content"),
  toolCalls: jsonb("tool_calls"),
  toolResults: jsonb("tool_results"),
  tokensUsed: integer("tokens_used"),
  latencyMs: integer("latency_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const agentActions = pgTable("agent_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").references(() => messages.id),
  userId: uuid("user_id").references(() => users.id).notNull(),
  actionType: text("action_type").$type<"read" | "write" | "send" | "search" | "execute">().notNull(),
  service: text("service").$type<"google_drive" | "google_docs" | "gmail" | "sheets" | "telegram" | "whatsapp" | "system">().notNull(),
  actionName: text("action_name").notNull(),
  parameters: jsonb("parameters"),
  result: jsonb("result"),
  status: text("status").$type<"pending" | "running" | "success" | "failed">().notNull().default("pending"),
  errorMessage: text("error_message"),
  executedAt: timestamp("executed_at"),
  completedAt: timestamp("completed_at")
});

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  service: text("service").$type<"google" | "telegram" | "whatsapp" | "notion" | "slack">().notNull(),
  displayName: text("display_name"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  metadata: jsonb("metadata"),
  isActive: boolean("is_active").default(true),
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const scheduledTasks = pgTable("scheduled_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  cronExpression: text("cron_expression").notNull(),
  prompt: text("prompt").notNull(),
  isActive: boolean("is_active").default(true),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),
  runCount: integer("run_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Since pgvector isn't standard in pg-core out of the box without pgvector library, we'll store embedding as jsonb or use custom types if needed.
// For now, let's use jsonb for the vector arrays to avoid import issues before setting up pgvector.
export const filesIndex = pgTable("files_index", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  service: text("service").$type<"google_drive" | "gmail_attachment">().notNull(),
  externalId: text("external_id").notNull(),
  name: text("name").notNull(),
  mimeType: text("mime_type"),
  summary: text("summary"),
  contentEmbedding: jsonb("content_embedding"), 
  lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull()
});

export const agentMemory = pgTable("agent_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  memoryType: text("memory_type").$type<"fact" | "preference" | "context" | "goal">().notNull(),
  content: text("content").notNull(),
  importanceScore: doublePrecision("importance_score").default(1.0),
  embedding: jsonb("embedding"),
  sourceMessageId: uuid("source_message_id").references(() => messages.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  conversations: many(conversations),
  integrations: many(integrations)
}));
