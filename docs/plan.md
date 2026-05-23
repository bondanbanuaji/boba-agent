# 🤖 AGENTIC AI ASSISTANT — FULL PLANNING DOCUMENT
> Web3 AI Chatbot Agent terintegrasi Google Workspace, Telegram, WhatsApp

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack Lengkap](#3-tech-stack-lengkap)
4. [Struktur Folder Project](#4-struktur-folder-project)
5. [Database Schema (Supabase + Drizzle)](#5-database-schema)
6. [Feature Modules](#6-feature-modules)
7. [API & Integration Plan](#7-api--integration-plan)
8. [Agent Tool System](#8-agent-tool-system)
9. [Frontend Pages & Components](#9-frontend-pages--components)
10. [Backend Services](#10-backend-services)
11. [Queue & Background Jobs](#11-queue--background-jobs)
12. [Auth & Security](#12-auth--security)
13. [Deployment Plan](#13-deployment-plan)
14. [Prompt Engineering Plan](#14-prompt-engineering-plan)
15. [Phase & Milestone Roadmap](#15-phase--milestone-roadmap)

---

## 1. PROJECT OVERVIEW

### Nama Project
**BOBA-AGENT** — Personal AI Command Center berbasis Web3

### Deskripsi
Platform web personal yang memungkinkan pengguna mengontrol seluruh ekosistem digital mereka (Google Workspace, Telegram, WhatsApp, dan lainnya) hanya melalui perintah chat natural language ke AI Agent berbasis Gemini. AI akan membaca, memahami, mengeksekusi, dan melaporkan semua aksi secara real-time langsung di dashboard web.

### Core Value Proposition
- Satu interface chat → kontrol semua tools digital
- AI Agent bisa baca isi dokumen, email, chat, file
- Eksekusi otomatis: kirim pesan, buat dokumen, baca laporan, isi spreadsheet
- Real-time streaming response dengan WebSocket
- Web3 identity & wallet integration sebagai auth layer tambahan

---

## 2. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                    BOBA-AGENT FRONTEND                        │
│              (Astro + React + TailwindCSS)               │
│   Chat UI │ Dashboard │ Logs │ Settings │ Web3 Auth      │
└───────────────────────┬─────────────────────────────────┘
                        │ WebSocket + REST API
┌───────────────────────▼─────────────────────────────────┐
│                  BOBA-AGENT BACKEND (Fastify)                  │
│   Auth │ Chat Router │ Agent Orchestrator │ Webhook      │
└─────┬─────────┬──────────────┬───────────────┬──────────┘
      │         │              │               │
   Gemini    Supabase      BullMQ         Tool Routers
   2.5 API     DB          + Redis    ┌────┬────┬────┬────┐
                                      │ GDrive Gmail Tele WA│
                                      └────┴────┴────┴────┘
```

### Arsitektur Alur Kerja

```
User ketik perintah
       ↓
Frontend kirim ke WebSocket
       ↓
Backend terima → simpan ke Supabase (message log)
       ↓
Gemini Agent orchestrator → parse intent & tools needed
       ↓
Tool Execution Engine → jalankan tools (parallel jika bisa)
       ↓
Tool results dikumpulkan → Gemini format response
       ↓
Stream response ke frontend via WebSocket
       ↓
Frontend render markdown, log aksi, update UI
```

---

## 3. TECH STACK LENGKAP

### Frontend Layer
| Package | Versi | Kegunaan |
|---------|-------|----------|
| Astro JS | latest | SSR/SSG framework utama |
| React | 18+ | UI components interaktif |
| TypeScript | 5+ | Type safety seluruh codebase |
| TailwindCSS | v4 | Utility-first styling |
| Shadcn/UI | latest | Component library (radix based) |
| DaisyUI | latest | Komponen tambahan Tailwind |
| Framer Motion | latest | Animasi & transitions |
| Three.js | latest | 3D background hero / Web3 visual |
| @studio-freight/lenis | latest | Smooth scroll |
| Lucide React | latest | Icon set |
| Zustand | latest | Global state management |
| @tanstack/react-query | latest | Server state & caching |
| socket.io-client | latest | Real-time WebSocket client |
| react-markdown | latest | Render markdown response AI |
| remark-gfm | latest | GitHub Flavored Markdown |
| rehype-highlight | latest | Syntax highlighting |
| Shiki | latest | Beautiful code highlighting |
| PrismJS | latest | Code highlighting fallback |

### Backend Layer
| Package | Versi | Kegunaan |
|---------|-------|----------|
| Fastify | latest | API server utama (lebih cepat dari Express) |
| Express | latest | Sub-service / webhook handler |
| socket.io | latest | WebSocket real-time |
| ws | latest | Raw WebSocket handler |
| Google Generative AI SDK | latest | Gemini 2.5 Flash / 2.0 Flash |
| Zod | latest | Schema validation request/response |
| dotenv | latest | Environment variables |
| jsonwebtoken | latest | JWT auth tokens |
| bcrypt | latest | Password hashing |
| Drizzle ORM | latest | Type-safe database queries |
| pg | latest | PostgreSQL driver (Supabase) |
| Redis | latest | Caching & pub/sub |
| BullMQ | latest | Background job queues |
| Upstash | latest | Serverless Redis (edge) |

### Infrastructure & Deployment
| Service | Kegunaan |
|---------|----------|
| Supabase | PostgreSQL DB + Auth + Storage + Realtime |
| Vercel | Frontend deployment (Astro) |
| Railway / Render | Backend deployment (Fastify) |
| Upstash Redis | Serverless Redis untuk BullMQ |
| Vercel KV | Edge caching |

### AI Models
```
GEMINI_MODEL_PRIMARY="gemini-2.5-flash"
GEMINI_MODEL_SECONDARY="gemini-2.0-flash"  
GEMINI_MODEL_FAST="gemini-flash-latest"
```

### External Integrations
| Service | SDK / Method |
|---------|-------------|
| Google Drive | googleapis (drive v3) |
| Google Docs | googleapis (docs v1) |
| Google Sheets | googleapis (sheets v4) |
| Gmail | googleapis (gmail v1) |
| Google Calendar | googleapis (calendar v3) |
| Telegram | telegraf.js / node-telegram-bot-api |
| WhatsApp | @whiskeysockets/baileys (WA Web) atau WATI API |
| Web3/Wallet | ethers.js + wagmi + viem |

---

## 4. STRUKTUR FOLDER PROJECT

```
BOBA-AGENT/
├── apps/
│   ├── web/                          # Astro Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Shadcn + DaisyUI components
│   │   │   │   ├── chat/             # Chat interface components
│   │   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   │   ├── integrations/     # Integration cards
│   │   │   │   ├── three/            # Three.js scenes
│   │   │   │   └── layout/           # Layout components
│   │   │   ├── pages/
│   │   │   │   ├── index.astro       # Landing page (Three.js hero)
│   │   │   │   ├── chat.astro        # Main chat interface
│   │   │   │   ├── dashboard.astro   # Analytics & overview
│   │   │   │   ├── integrations.astro # Connect services
│   │   │   │   ├── logs.astro        # Action logs & history
│   │   │   │   ├── settings.astro    # User settings
│   │   │   │   └── auth/
│   │   │   │       ├── login.astro
│   │   │   │       └── callback.astro
│   │   │   ├── stores/               # Zustand stores
│   │   │   │   ├── chatStore.ts
│   │   │   │   ├── agentStore.ts
│   │   │   │   └── integrationStore.ts
│   │   │   ├── hooks/                # React custom hooks
│   │   │   ├── lib/                  # Utils, constants
│   │   │   └── styles/               # Global CSS, Tailwind config
│   │   ├── astro.config.mjs
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                          # Fastify Backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts           # JWT auth endpoints
│       │   │   ├── chat.ts           # Chat message endpoints
│       │   │   ├── agent.ts          # Agent execution endpoints
│       │   │   ├── integrations.ts   # OAuth & service connection
│       │   │   ├── tools.ts          # Tool management
│       │   │   └── webhooks/
│       │   │       ├── telegram.ts
│       │   │       ├── whatsapp.ts
│       │   │       └── google.ts
│       │   ├── services/
│       │   │   ├── gemini/
│       │   │   │   ├── client.ts     # Gemini API client
│       │   │   │   ├── agent.ts      # Agent orchestrator
│       │   │   │   ├── tools.ts      # Tool definitions for Gemini
│       │   │   │   └── streaming.ts  # Stream handler
│       │   │   ├── google/
│       │   │   │   ├── auth.ts       # OAuth2 flow
│       │   │   │   ├── drive.ts      # Drive operations
│       │   │   │   ├── docs.ts       # Docs operations
│       │   │   │   ├── sheets.ts     # Sheets operations
│       │   │   │   ├── gmail.ts      # Gmail operations
│       │   │   │   └── calendar.ts   # Calendar operations
│       │   │   ├── telegram/
│       │   │   │   ├── bot.ts        # Telegraf bot instance
│       │   │   │   ├── reader.ts     # Read messages/chats
│       │   │   │   └── sender.ts     # Send messages
│       │   │   ├── whatsapp/
│       │   │   │   ├── client.ts     # Baileys/WATI client
│       │   │   │   ├── reader.ts     # Read messages
│       │   │   │   └── sender.ts     # Send messages
│       │   │   └── web3/
│       │   │       └── verify.ts     # Wallet signature verify
│       │   ├── agent/
│       │   │   ├── orchestrator.ts   # Main agent brain
│       │   │   ├── planner.ts        # Multi-step plan execution
│       │   │   ├── memory.ts         # Conversation memory
│       │   │   ├── context.ts        # Context builder
│       │   │   └── executor.ts       # Tool execution engine
│       │   ├── db/
│       │   │   ├── schema.ts         # Drizzle schema
│       │   │   ├── migrations/       # DB migrations
│       │   │   └── queries/          # Typed query functions
│       │   ├── queue/
│       │   │   ├── workers/          # BullMQ workers
│       │   │   └── jobs/             # Job definitions
│       │   ├── websocket/
│       │   │   └── handler.ts        # Socket.io handler
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── rateLimit.ts
│       │   │   └── logger.ts
│       │   └── utils/
│       ├── drizzle.config.ts
│       └── package.json
│
├── packages/
│   ├── shared-types/                 # Shared TypeScript types
│   └── shared-utils/                 # Shared utility functions
│
├── .env.example
├── turbo.json                        # Turborepo config
└── package.json                      # Monorepo root
```

---

## 5. DATABASE SCHEMA

### Supabase + Drizzle ORM Schema

#### Tabel: `users`
```
- id (uuid, PK)
- email (text, unique)
- password_hash (text, nullable — untuk non-OAuth)
- wallet_address (text, nullable — Web3 auth)
- display_name (text)
- avatar_url (text)
- role (enum: admin, user)
- created_at, updated_at
```

#### Tabel: `sessions`
```
- id (uuid, PK)
- user_id (FK → users.id)
- token_hash (text)
- expires_at (timestamp)
- ip_address (text)
- user_agent (text)
- created_at
```

#### Tabel: `conversations`
```
- id (uuid, PK)
- user_id (FK → users.id)
- title (text)
- model_used (text)
- total_tokens (integer)
- is_archived (boolean)
- created_at, updated_at
```

#### Tabel: `messages`
```
- id (uuid, PK)
- conversation_id (FK → conversations.id)
- user_id (FK → users.id)
- role (enum: user, assistant, tool, system)
- content (text — plain or markdown)
- raw_content (jsonb — full Gemini response object)
- tool_calls (jsonb — array of tool calls)
- tool_results (jsonb — array of tool results)
- tokens_used (integer)
- latency_ms (integer)
- created_at
```

#### Tabel: `agent_actions`
```
- id (uuid, PK)
- message_id (FK → messages.id)
- user_id (FK → users.id)
- action_type (enum: read, write, send, search, execute)
- service (enum: google_drive, google_docs, gmail, sheets, telegram, whatsapp)
- action_name (text — e.g: "send_telegram_message")
- parameters (jsonb — input params)
- result (jsonb — output/result)
- status (enum: pending, running, success, failed)
- error_message (text, nullable)
- executed_at, completed_at
```

#### Tabel: `integrations`
```
- id (uuid, PK)
- user_id (FK → users.id)
- service (enum: google, telegram, whatsapp, notion, slack)
- display_name (text)
- access_token (text, encrypted)
- refresh_token (text, encrypted)
- token_expires_at (timestamp)
- metadata (jsonb — extra data per service)
- is_active (boolean)
- connected_at, updated_at
```

#### Tabel: `scheduled_tasks`
```
- id (uuid, PK)
- user_id (FK → users.id)
- name (text)
- cron_expression (text)
- prompt (text — command yang akan dijalankan)
- is_active (boolean)
- last_run_at (timestamp)
- next_run_at (timestamp)
- run_count (integer)
- created_at
```

#### Tabel: `files_index`
```
- id (uuid, PK)
- user_id (FK → users.id)
- service (enum: google_drive, gmail_attachment)
- external_id (text — file ID di service)
- name (text)
- mime_type (text)
- summary (text — AI-generated summary)
- content_embedding (vector — pgvector for semantic search)
- last_synced_at (timestamp)
```

#### Tabel: `agent_memory`
```
- id (uuid, PK)
- user_id (FK → users.id)
- memory_type (enum: fact, preference, context, goal)
- content (text)
- importance_score (float)
- embedding (vector)
- source_message_id (FK, nullable)
- created_at, updated_at
```

---

## 6. FEATURE MODULES

### Module 1: AI Chat Interface
- Chat real-time dengan streaming response (token by token)
- Multi-conversation dengan history
- Markdown rendering lengkap dengan syntax highlighting
- Code block dengan copy button
- Tool call visualization (tampilkan aksi yang sedang dijalankan)
- Message status: sending → processing → tool_running → completed
- Retry & regenerate response
- Export conversation ke PDF / Markdown

### Module 2: Google Workspace Agent
**Google Drive**
- List semua file/folder
- Search file berdasarkan nama/konten
- Download & upload file
- Share file ke email tertentu
- Buat folder baru
- Move/copy file

**Google Docs**
- Baca isi dokumen lengkap
- Buat dokumen baru dengan konten
- Edit/append konten ke dokumen
- Export ke PDF
- AI summarize dokumen

**Google Sheets**
- Baca data spreadsheet (range tertentu atau semua)
- Tulis/update data ke cell/range
- Buat sheet baru
- Append row baru
- Filter & query data
- AI analyze data dan generate insight

**Gmail**
- Baca inbox (unread, recent, search)
- Baca isi email lengkap
- Kirim email baru
- Reply email
- Forward email
- Archive/delete/label email
- AI draft email dari prompt

**Google Calendar**
- Lihat upcoming events
- Buat event baru
- Update/delete event
- Check ketersediaan waktu

### Module 3: Telegram Agent
- Baca semua chat/conversation (personal & group)
- Cari pesan berdasarkan keyword
- Kirim pesan ke kontak/group
- Reply pesan
- Forward pesan
- Baca history chat dari tanggal tertentu
- Monitor mention di group
- Send media (foto, dokumen)

### Module 4: WhatsApp Agent
- Baca semua chat/conversation
- Cari pesan berdasarkan keyword
- Kirim pesan ke nomor/kontak
- Reply pesan
- Forward pesan
- Kirim media
- Baca status/story
- Buat pesan broadcast

### Module 5: Scheduled Tasks & Automation
- Buat jadwal task dengan cron expression
- Contoh: "Kirim laporan Gmail summary setiap pagi jam 8"
- Contoh: "Backup semua Google Sheet ke Drive setiap minggu"
- Dashboard task scheduler
- Log eksekusi otomatis
- Enable/disable/edit tasks

### Module 6: Memory & Context
- AI mengingat preferensi user
- Long-term memory dari conversation
- Semantic search di memory
- Context window management
- Auto-summarize conversation panjang

### Module 7: File Intelligence
- Index semua file dari Google Drive
- AI summarize setiap dokumen
- Semantic search across all files
- Vector embeddings untuk file content
- "Cari file yang membahas tentang X"

### Module 8: Web3 Integration
- Login dengan MetaMask / WalletConnect
- Verify wallet signature untuk auth
- Display wallet balance
- On-chain identity
- NFT gating untuk fitur premium (opsional)

### Module 9: Dashboard & Analytics
- Total messages sent
- Actions executed per service
- Most used tools
- Token usage & cost
- Response latency
- Integration health status

### Module 10: Logs & Audit Trail
- Semua aksi agent tercatat
- Filter by service, date, status
- Error logs
- Re-run failed actions
- Export logs

---

## 7. API & INTEGRATION PLAN

### Google OAuth2 Flow
```
SETUP:
1. Buat project di Google Cloud Console
2. Enable APIs: Drive, Docs, Sheets, Gmail, Calendar
3. Buat OAuth2 credentials (Web Application)
4. Set redirect URI: https://your-api.railway.app/auth/google/callback

SCOPES REQUIRED:
- https://www.googleapis.com/auth/drive
- https://www.googleapis.com/auth/documents
- https://www.googleapis.com/auth/spreadsheets
- https://www.googleapis.com/auth/gmail.modify
- https://www.googleapis.com/auth/calendar

FLOW:
User click "Connect Google" → redirect ke Google OAuth
→ user approve scopes → callback dengan code
→ exchange code untuk access_token + refresh_token
→ encrypt & simpan ke integrations table
→ auto-refresh token saat expired
```

### Telegram Bot Setup
```
SETUP:
1. Buat bot baru via @BotFather di Telegram
2. Dapat BOT_TOKEN
3. Set webhook URL ke backend endpoint

UNTUK BACA PESAN USER (bukan hanya bot):
- Gunakan Telegram User API (MTProto) via gramjs/telegram library
- User perlu login dengan phone number + 2FA
- Session string disimpan terenkripsi di DB

WEBHOOK ENDPOINT: POST /webhooks/telegram
- Terima update dari Telegram
- Route ke agent jika pesan mengandung command
```

### WhatsApp Setup
```
OPSI A - WhatsApp Web (Baileys - Gratis):
- Gunakan @whiskeysockets/baileys
- User scan QR code via web app
- Session disimpan di Supabase storage
- Reconnect otomatis jika disconnect
- Risk: akun bisa di-ban WhatsApp

OPSI B - WATI / Interakt API (Berbayar, Lebih Stable):
- Daftar business API
- Webhook-based
- Hanya bisa kirim ke nomor yang opt-in
- Lebih aman untuk production

REKOMENDASI: Mulai dengan Baileys untuk MVP, migrate ke WATI untuk production
```

### Gemini API Function Calling
```
SETUP:
- API_KEY dari Google AI Studio
- Model: gemini-2.5-flash (primary)
- Gunakan Function Calling feature
- Definisikan semua tools sebagai function declarations
- Gemini akan otomatis pilih tool yang dibutuhkan

TOOL DECLARATION PATTERN:
{
  name: "send_telegram_message",
  description: "Kirim pesan ke kontak atau grup Telegram",
  parameters: {
    type: "object",
    properties: {
      chat_id: { type: "string", description: "ID atau username tujuan" },
      message: { type: "string", description: "Isi pesan yang akan dikirim" }
    },
    required: ["chat_id", "message"]
  }
}
```

---

## 8. AGENT TOOL SYSTEM

### Daftar Lengkap Tools (Function Declarations untuk Gemini)

#### Google Drive Tools
```
- gdrive_list_files(folder_id?, query?)
- gdrive_search_files(query, file_type?)
- gdrive_get_file_info(file_id)
- gdrive_read_file(file_id)
- gdrive_create_folder(name, parent_folder_id?)
- gdrive_upload_file(name, content, mime_type, folder_id?)
- gdrive_move_file(file_id, folder_id)
- gdrive_share_file(file_id, email, role)
- gdrive_delete_file(file_id)
```

#### Google Docs Tools
```
- gdocs_read_document(document_id)
- gdocs_create_document(title, content?)
- gdocs_append_content(document_id, content)
- gdocs_replace_content(document_id, search_text, replacement)
- gdocs_export_pdf(document_id)
- gdocs_get_document_summary(document_id)
```

#### Google Sheets Tools
```
- gsheets_read_sheet(spreadsheet_id, range?)
- gsheets_write_cells(spreadsheet_id, range, values)
- gsheets_append_row(spreadsheet_id, sheet_name, values)
- gsheets_create_spreadsheet(title)
- gsheets_add_sheet(spreadsheet_id, sheet_name)
- gsheets_clear_range(spreadsheet_id, range)
- gsheets_get_all_sheets(spreadsheet_id)
- gsheets_format_cells(spreadsheet_id, range, format_options)
```

#### Gmail Tools
```
- gmail_list_emails(query?, max_results?, label?)
- gmail_read_email(message_id)
- gmail_send_email(to, subject, body, cc?, attachments?)
- gmail_reply_email(message_id, body)
- gmail_forward_email(message_id, to)
- gmail_archive_email(message_id)
- gmail_delete_email(message_id)
- gmail_add_label(message_id, label)
- gmail_search_emails(query)
- gmail_get_unread_count()
- gmail_draft_email(to, subject, context_prompt)
```

#### Google Calendar Tools
```
- gcal_list_events(time_min?, time_max?, max_results?)
- gcal_create_event(title, start_time, end_time, description?, attendees?)
- gcal_update_event(event_id, updates)
- gcal_delete_event(event_id)
- gcal_check_availability(start_time, end_time)
```

#### Telegram Tools
```
- tg_list_chats(limit?)
- tg_read_chat(chat_id, limit?)
- tg_search_messages(query, chat_id?)
- tg_send_message(chat_id, message)
- tg_reply_message(message_id, chat_id, reply_text)
- tg_forward_message(message_id, from_chat_id, to_chat_id)
- tg_get_contact_info(username_or_id)
- tg_get_chat_history(chat_id, date_from?, date_to?)
- tg_send_file(chat_id, file_url_or_path, caption?)
```

#### WhatsApp Tools
```
- wa_list_chats(limit?)
- wa_read_chat(chat_id, limit?)
- wa_search_messages(query, chat_id?)
- wa_send_message(phone_or_chat_id, message)
- wa_reply_message(message_id, chat_id, reply_text)
- wa_send_media(chat_id, media_url, caption?)
- wa_get_contact_info(phone)
- wa_get_chat_history(chat_id, date_from?, date_to?)
- wa_create_group_message(group_id, message)
```

#### System & Utility Tools
```
- web_search(query)
- get_current_datetime()
- create_scheduled_task(name, cron_expression, prompt)
- get_agent_memory(query)
- save_agent_memory(content, memory_type)
- summarize_content(content, max_length?)
- translate_text(text, target_language)
```

---

## 9. FRONTEND PAGES & COMPONENTS

### Landing Page (`/`)
**Sections:**
- Hero section dengan Three.js 3D scene (particle network / holographic globe)
- Lenis smooth scroll
- Feature showcase dengan scroll-triggered animations
- Integration logos (Google, Telegram, WhatsApp)
- Demo GIF/video embed
- Pricing section (jika ada)
- CTA: "Launch App" / "Connect Wallet"

**Components:**
- `<ThreeJsHero />` — 3D animated background
- `<FeatureCard />` — Animated feature cards
- `<IntegrationShowcase />` — Logo cloud dengan hover effects
- `<GlowButton />` — CTA button dengan glow effect

### Chat Interface (`/chat`)
**Layout:** Split panel (sidebar kiri + chat utama)

**Sidebar:**
- Daftar conversations
- New chat button
- Search conversations
- Archive / Delete conversation

**Chat Area:**
- Message list dengan virtualization (react-virtual)
- User message bubble
- Assistant message bubble (streaming, markdown)
- Tool call cards (collapsed/expanded view)
- Action status indicator saat agent menjalankan tools
- Input area: textarea + submit button + attachment

**Components:**
- `<MessageBubble />` — Render message user/assistant
- `<ToolCallCard />` — Visualisasi tool yang dipanggil
- `<StreamingIndicator />` — Animasi saat streaming
- `<ChatInput />` — Input dengan auto-resize
- `<ConversationSidebar />` — List conversation
- `<ActionBadge />` — Badge status eksekusi (running/done/error)

### Dashboard (`/dashboard`)
**Widgets:**
- Total actions today
- Token usage meter
- Integration status cards
- Recent agent actions timeline
- Quick command shortcuts
- Recent conversations

**Components:**
- `<StatCard />` — Stat dengan animasi counter
- `<IntegrationStatusCard />` — Health per service
- `<ActionTimeline />` — Feed aksi terbaru
- `<QuickCommand />` — Tombol shortcut command

### Integrations (`/integrations`)
**Per Service Card:**
- Status (connected/disconnected)
- Connect/Disconnect button
- Last synced time
- Permissions granted
- Test connection button

**Services Shown:**
- Google (Drive, Docs, Sheets, Gmail, Calendar) — satu OAuth
- Telegram (Bot + User API)
- WhatsApp (QR scan)
- (Extensible untuk Notion, Slack, dsb)

### Logs (`/logs`)
- Filter: service, date range, status, action type
- Table dengan pagination
- Row detail expand
- Export sebagai CSV
- Re-run failed action
- Real-time log stream toggle

### Settings (`/settings`)
**Tabs:**
- Profile (nama, avatar, email)
- AI Configuration (model choice, temperature, system prompt custom)
- Notifications
- API Keys (custom Gemini key)
- Security (2FA, sessions)
- Danger Zone (delete account)

### Auth (`/auth`)
- Login dengan email/password
- OAuth: Google Sign-In
- Web3: Connect Wallet (MetaMask, WalletConnect)
- Wallet sign message untuk verify identity

---

## 10. BACKEND SERVICES

### Fastify Server Structure
```
PLUGINS TO REGISTER:
- @fastify/cors
- @fastify/helmet
- @fastify/rate-limit
- @fastify/jwt
- @fastify/cookie
- @fastify/multipart (file uploads)
- socket.io attached ke Fastify server

PORT: 3001 (dev), auto dari env (prod)
```

### Agent Orchestrator Logic
```
STEP 1 — Receive message
  - Validasi user & conversation
  - Build context (conversation history + user memory + integration status)

STEP 2 — Gemini Function Calling
  - Kirim ke Gemini dengan full tool declarations
  - Gemini response: text ATAU tool_call(s)

STEP 3 — Tool Execution
  - Jika ada tool_calls → execute via Tool Router
  - Tool results dikembalikan ke Gemini sebagai tool_result
  - Loop sampai Gemini tidak memanggil tool lagi

STEP 4 — Final Response
  - Stream teks final ke client via WebSocket
  - Simpan semua messages ke DB
  - Log semua actions ke agent_actions table

STEP 5 — Memory Update
  - Extract facts/preferences dari conversation
  - Upsert ke agent_memory table
```

### WebSocket Events
```
CLIENT → SERVER:
- "chat:send" { conversation_id, content }
- "chat:stop" { conversation_id }
- "agent:status:subscribe" { }

SERVER → CLIENT:
- "chat:stream:start" { message_id }
- "chat:stream:token" { token }
- "chat:stream:end" { message_id, tokens_used }
- "agent:tool:start" { tool_name, parameters }
- "agent:tool:end" { tool_name, result, status }
- "agent:error" { error_message }
```

### Rate Limiting Strategy
```
- Chat endpoint: 30 requests/minute per user
- Tool execution: 100 tool calls/hour per user  
- File uploads: 50MB/day per user
- API endpoints: 200 requests/minute per IP
```

---

## 11. QUEUE & BACKGROUND JOBS

### BullMQ Queues

#### Queue: `agent-tasks`
- Process agent requests yang berat secara async
- Worker dengan concurrency 5
- Retry 3x dengan exponential backoff

#### Queue: `scheduled-tasks`
- Jalankan scheduled commands user
- Cron-based via bullmq cron jobs
- Log hasil ke agent_actions

#### Queue: `file-indexing`
- Index file baru dari Google Drive
- Generate AI summary per file
- Generate embeddings untuk semantic search

#### Queue: `token-refresh`
- Refresh OAuth tokens sebelum expired
- Check semua integrations setiap jam

#### Queue: `notifications`
- Kirim notifikasi ke user
- Email digest, push notification

---

## 12. AUTH & SECURITY

### Auth Flow
```
OPSI 1 — Email/Password:
- bcrypt hash password
- JWT access token (15 menit) + refresh token (7 hari)
- Refresh token rotation

OPSI 2 — Google OAuth:
- Sign in with Google
- Create/update user record
- Sama-sama dapat JWT

OPSI 3 — Web3 Wallet:
- User connect wallet
- Backend generate nonce
- User sign nonce dengan private key
- Backend verify signature via ethers.js
- Dapat JWT jika valid
```

### Security Measures
```
- Semua OAuth tokens dienkripsi di DB (AES-256)
- JWT dengan short expiry + refresh token rotation
- Rate limiting per endpoint
- Input sanitization dengan Zod
- CORS hanya allow frontend domain
- Helmet.js security headers
- SQL injection prevention via Drizzle ORM
- XSS prevention via proper React rendering
- HTTPS only di production
- Row Level Security (RLS) di Supabase
```

### Supabase RLS Policies
```
- Users hanya bisa baca data milik sendiri
- Messages hanya bisa diakses oleh pemilik conversation
- Agent actions hanya visible ke user yang bersangkutan
- Integrations data isolated per user
```

---

## 13. DEPLOYMENT PLAN

### Environment Variables
```
# Database
DATABASE_URL=postgresql://...supabase.co/postgres

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=

# Gemini AI
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_API_ID=
TELEGRAM_API_HASH=

# WhatsApp
WA_SESSION_SECRET=

# Redis (Upstash)
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# App
FRONTEND_URL=https://BOBA-AGENT.yourdomain.com
API_URL=https://api.BOBA-AGENT.yourdomain.com
```

### Deployment Services
```
FRONTEND (Astro → Vercel):
- Auto-deploy dari GitHub main branch
- Edge network CDN
- Environment variables via Vercel dashboard
- Custom domain

BACKEND (Fastify → Railway):
- Docker container
- Auto-scale workers
- Persistent storage untuk WA sessions
- Custom domain untuk API

DATABASE:
- Supabase hosted PostgreSQL
- Enable pgvector extension untuk embeddings
- Enable Supabase Realtime untuk live updates

REDIS:
- Upstash serverless Redis
- BullMQ compatible
- Global edge replication
```

---

## 14. PROMPT ENGINEERING PLAN

### System Prompt untuk Agent
```
Kamu adalah BOBA-AGENT, personal AI assistant yang memiliki akses ke semua 
tools digital pengguna. Kamu bisa membaca, menulis, dan mengeksekusi 
aksi di Google Workspace (Drive, Docs, Sheets, Gmail, Calendar), 
Telegram, dan WhatsApp atas perintah pengguna.

PRINSIP:
1. Selalu konfirmasi sebelum melakukan aksi destruktif (delete, send email massal)
2. Eksekusi aksi secara paralel jika memungkinkan untuk efisiensi
3. Laporkan setiap aksi yang berhasil dan yang gagal
4. Jika ada informasi yang ambigu, tanyakan klarifikasi
5. Ingat konteks dan preferensi user dari memory
6. Respons dalam bahasa yang sama dengan user

SAAT MENGEKSEKUSI TOOLS:
- Lakukan planning singkat sebelum eksekusi
- Eksekusi tools yang diperlukan
- Ringkas hasil dengan jelas
- Tawarkan aksi lanjutan jika relevan

FORMAT RESPONS:
- Gunakan markdown untuk formatting
- Gunakan emoji untuk visual feedback (✅❌⚠️📧📁)
- Tabel untuk data tabular
- Code block untuk data teknis
```

### Intent Categories & Routing
```
BACA/LIHAT → Tools: list/read/search
  "tampilkan email terbaru"
  "baca file X di drive"
  "lihat chat telegram dari si A"

TULIS/BUAT → Tools: create/write/compose  
  "buat dokumen laporan bulan ini"
  "tambah row ke spreadsheet"
  "draft email ke client"

KIRIM/EKSEKUSI → Tools: send/execute
  "kirim pesan ke grup telegram"
  "balas email dari X"
  "forward pesan ke Y"

ANALISIS/RINGKAS → Tools: read + Gemini analysis
  "rangkum isi email hari ini"
  "analisis data di sheet penjualan"
  "ringkas dokumen laporan"

JADWALKAN → Tools: create_scheduled_task
  "ingatkan aku setiap senin untuk..."
  "kirim laporan otomatis setiap hari"
```

---

## 15. PHASE & MILESTONE ROADMAP

### Phase 1 — Foundation (Minggu 1-2)
```
✅ Setup monorepo (Turborepo)
✅ Setup Astro + React + TailwindCSS + Shadcn
✅ Setup Fastify backend
✅ Setup Supabase + Drizzle ORM
✅ Setup Upstash Redis + BullMQ
✅ Auth system (email/password + JWT)
✅ Database migrations
✅ Landing page (Three.js hero)
✅ Basic chat UI (tanpa AI dulu)
✅ WebSocket connection
```

### Phase 2 — AI Core (Minggu 3-4)
```
✅ Gemini API integration
✅ Streaming response
✅ Function calling setup
✅ Agent orchestrator
✅ Tool execution engine
✅ Conversation history & memory
✅ Chat UI dengan streaming
✅ Tool call visualization
```

### Phase 3 — Google Integration (Minggu 5-6)
```
✅ Google OAuth2 flow
✅ Gmail tools (read, send, search)
✅ Google Drive tools (list, read, search)
✅ Google Docs tools (read, create, edit)
✅ Google Sheets tools (read, write)
✅ Google Calendar tools
✅ Integration status dashboard
✅ Token refresh automation
```

### Phase 4 — Messaging Integrations (Minggu 7-8)
```
✅ Telegram bot setup + webhooks
✅ Telegram User API (read personal messages)
✅ Telegram tools (read, send, search)
✅ WhatsApp Baileys integration
✅ WhatsApp QR scan flow
✅ WhatsApp tools (read, send)
✅ Session persistence
```

### Phase 5 — Advanced Features (Minggu 9-10)
```
✅ Scheduled tasks system
✅ File indexing + embeddings
✅ Semantic search across files
✅ Long-term memory system
✅ Logs page & audit trail
✅ Dashboard analytics
✅ Web3 auth (MetaMask)
```

### Phase 6 — Polish & Deploy (Minggu 11-12)
```
✅ Performance optimization
✅ Error handling & recovery
✅ Mobile responsive
✅ Lenis smooth scroll
✅ Framer Motion transitions
✅ Three.js optimization
✅ Security audit
✅ Production deployment
✅ Domain setup
✅ Monitoring setup (Sentry / Betterstack)
```

---

## 🚀 QUICK START ORDER (Urutan Pengerjaan Optimal)

1. **Buat repo monorepo** dengan Turborepo + setup semua package.json
2. **Setup Supabase project** + run schema migrations via Drizzle
3. **Setup Fastify + Drizzle** + pastikan koneksi DB berjalan
4. **Auth system** + JWT + Supabase RLS
5. **Astro + React setup** + TailwindCSS + Shadcn
6. **Landing page** + Three.js hero + Lenis
7. **WebSocket** setup antara frontend ↔ backend
8. **Chat UI** basic
9. **Gemini integration** + streaming + tool calling
10. **Google OAuth** + Gmail + Drive (paling berguna duluan)
11. **Telegram** integration
12. **WhatsApp** integration
13. **Scheduled tasks** + automation
14. **Dashboard** + analytics
15. **Polish** + deploy

---

## 📝 NOTES PENTING

### Tentang WhatsApp
WhatsApp tidak punya official API gratis untuk personal use. Pilihan:
- **Baileys** (open source, informal, WA Web protocol) — gratis tapi risiko ban
- **WATI/Interakt** (official WhatsApp Business API) — berbayar, lebih aman

### Tentang Telegram User API
Untuk baca pesan personal (bukan hanya bot messages), perlu Telegram User API:
- Daftar di my.telegram.org → dapat `api_id` dan `api_hash`
- Gunakan library `gramjs` atau `MTKruto`
- User perlu login dengan phone number

### Tentang Web3
Web3 bisa dijadikan auth tambahan (bukan satu-satunya):
- Sign in with Ethereum (SIWE) standard
- Wallet address disimpan di user profile
- Bisa gating fitur premium via NFT ownership check

### Rate Limits Gemini
- Gemini 2.5 Flash: 1500 RPM (free tier)
- Untuk production, pertimbangkan paid tier
- Implementasi request queue dengan BullMQ untuk throttling

---
