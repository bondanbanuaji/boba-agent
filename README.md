<div align="center">

# 🧋 BOBA-AGENT

### Personal AI Command Center

**Kontrol seluruh ekosistem digital kamu lewat satu chat AI.**
**Control your entire digital ecosystem through a single AI chat.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-Backend-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![Astro](https://img.shields.io/badge/Astro-Frontend-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Gemini](https://img.shields.io/badge/Gemini_2.5-AI_Core-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

<br/>

[🇮🇩 Bahasa Indonesia](#-bahasa-indonesia) · [🇬🇧 English](#-english)

</div>

---

<!-- ============================================================ -->
<!-- BAHASA INDONESIA                                              -->
<!-- ============================================================ -->

# 🇮🇩 Bahasa Indonesia

## 📖 Tentang

**Boba-Agent** adalah platform AI Agent personal berbasis web yang memungkinkan kamu mengontrol seluruh ekosistem digital — Google Workspace (Gmail, Drive, Docs, Sheets, Calendar), Telegram, WhatsApp, dan Web3 wallet — hanya melalui perintah chat natural language ke AI Agent berbasis **Google Gemini**.

Cukup ketik apa yang kamu mau, dan AI Agent akan **membaca, memahami, mengeksekusi, dan melaporkan** hasilnya secara real-time langsung di dashboard.

## ✨ Fitur Utama

### 🤖 AI Agent Cerdas
- Chat natural language ke AI berbasis **Gemini 2.5 Flash**
- Multi-step planning & execution — AI bisa merencanakan dan menjalankan aksi bertahap
- Streaming response real-time via **WebSocket**
- Conversation memory — AI ingat konteks pembicaraan sebelumnya

### 📧 Google Workspace Integration
- **Gmail** — Baca, cari, kirim, dan balas email
- **Google Drive** — Browse, upload, download, dan kelola file
- **Google Docs** — Baca dan buat dokumen
- **Google Sheets** — Baca, tulis, dan analisis spreadsheet
- **Google Calendar** — Lihat jadwal, buat event, atur reminder

### 💬 Messaging Integration
- **Telegram** — Baca chat, kirim pesan, kelola bot
- **WhatsApp** — Integrasi via Baileys (scan QR, kirim/baca pesan)

### 🔗 Web3 Integration
- Autentikasi dengan wallet (WalletConnect)
- Verifikasi signature sebagai identity layer tambahan

### ⚡ Arsitektur Modern
- **Turborepo** monorepo — satu repository untuk semua
- **Fastify** backend — cepat dan efisien
- **Astro + React** frontend — performa optimal
- **Drizzle ORM** — type-safe database queries
- **BullMQ + Redis** — background job queue
- **Socket.IO** — komunikasi real-time

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Astro + React)              │
│       Chat UI  │  Dashboard  │  Logs  │  Settings       │
└───────────────────────┬─────────────────────────────────┘
                        │ WebSocket + REST API
┌───────────────────────▼─────────────────────────────────┐
│                  BACKEND (Fastify + TypeScript)          │
│     Auth  │  Chat Router  │  Agent Orchestrator         │
└─────┬─────────┬──────────────┬───────────────┬──────────┘
      │         │              │               │
   Gemini    Supabase       BullMQ       Tool System
   2.5 API   (PostgreSQL)   + Redis    ┌────┬────┬────┐
                                       │GDrive│Tele│ WA │
                                       └────┴────┴────┘
```

## 📁 Struktur Project

```
boba-agent/
├── apps/
│   ├── api/                  # 🔧 Backend — Fastify + TypeScript
│   │   ├── src/
│   │   │   ├── agent/        #    AI Agent & Orchestrator
│   │   │   ├── db/           #    Database schema & migrations
│   │   │   ├── middleware/   #    Auth, rate limit, logger
│   │   │   ├── queue/        #    BullMQ job processors
│   │   │   ├── routes/       #    API endpoints
│   │   │   ├── services/     #    Business logic & integrations
│   │   │   ├── utils/        #    Helper utilities
│   │   │   ├── websocket/    #    Socket.IO handlers
│   │   │   └── index.ts      #    Entry point
│   │   └── drizzle.config.ts
│   │
│   └── web/                  # 🎨 Frontend — Astro + React + Tailwind
│       ├── src/
│       ├── public/
│       └── astro.config.mjs
│
├── packages/
│   ├── shared-types/         # 📦 Shared TypeScript type definitions
│   └── shared-utils/         # 📦 Shared utility functions
│
├── docs/
│   ├── plan.md               # 📋 Full planning document
│   └── setup.md              # 📋 Local setup guide
│
├── .env.example              # 🔑 Template environment variables
├── turbo.json                # ⚙️ Turborepo config
├── package.json              # ⚙️ Root workspace config
└── LICENSE                   # 📄 MIT License
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>= 22.12.0`
- **PostgreSQL** `>= 15`
- **Redis** `>= 7` (opsional, untuk background jobs)

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/<username>/boba-agent.git
cd boba-agent

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# → Edit kedua file .env dengan value yang sesuai

# 4. Setup database
psql -U postgres -c "CREATE DATABASE boba_agent;"
cd apps/api
npx drizzle-kit generate
npx drizzle-kit migrate
cd ../..

# 5. Jalankan!
npm run dev
```

| Service | URL |
|---------|-----|
| 🔧 API Server | `http://localhost:3001` |
| 🎨 Web Frontend | `http://localhost:4321` |

> 📖 Panduan setup lengkap: [docs/setup.md](./docs/setup.md)

## 🔑 Environment Variables

Lihat template lengkap di file berikut:

| File | Deskripsi |
|------|-----------|
| [`.env.example`](./.env.example) | Template global (referensi) |
| [`apps/api/.env.example`](./apps/api/.env.example) | Backend — Database, JWT, Gemini, OAuth, Messaging, Redis |
| [`apps/web/.env.example`](./apps/web/.env.example) | Frontend — API URL, WalletConnect |

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Astro, React, TypeScript, TailwindCSS v4 |
| **Backend** | Fastify, TypeScript, Socket.IO |
| **AI** | Google Gemini 2.5 Flash |
| **Database** | PostgreSQL (Supabase), Drizzle ORM |
| **Queue** | BullMQ, Redis / Upstash |
| **Auth** | JWT, OAuth2, Web3 Wallet |
| **Monorepo** | Turborepo, npm workspaces |
| **Messaging** | Telegraf.js, @whiskeysockets/baileys |
| **Google APIs** | googleapis (Drive, Docs, Sheets, Gmail, Calendar) |

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE) — bebas digunakan, dimodifikasi, dan didistribusikan.

---

<!-- ============================================================ -->
<!-- ENGLISH                                                       -->
<!-- ============================================================ -->

# 🇬🇧 English

## 📖 About

**Boba-Agent** is a personal AI Agent web platform that lets you control your entire digital ecosystem — Google Workspace (Gmail, Drive, Docs, Sheets, Calendar), Telegram, WhatsApp, and Web3 wallets — through natural language chat commands powered by **Google Gemini**.

Just type what you want, and the AI Agent will **read, understand, execute, and report** the results in real-time directly on your dashboard.

## ✨ Key Features

### 🤖 Intelligent AI Agent
- Natural language chat powered by **Gemini 2.5 Flash**
- Multi-step planning & execution — the AI plans and executes actions step by step
- Real-time streaming responses via **WebSocket**
- Conversation memory — the AI remembers previous context

### 📧 Google Workspace Integration
- **Gmail** — Read, search, send, and reply to emails
- **Google Drive** — Browse, upload, download, and manage files
- **Google Docs** — Read and create documents
- **Google Sheets** — Read, write, and analyze spreadsheets
- **Google Calendar** — View schedules, create events, set reminders

### 💬 Messaging Integration
- **Telegram** — Read chats, send messages, manage bots
- **WhatsApp** — Integration via Baileys (QR scan, send/read messages)

### 🔗 Web3 Integration
- Wallet authentication (WalletConnect)
- Signature verification as an additional identity layer

### ⚡ Modern Architecture
- **Turborepo** monorepo — one repository for everything
- **Fastify** backend — fast and efficient
- **Astro + React** frontend — optimal performance
- **Drizzle ORM** — type-safe database queries
- **BullMQ + Redis** — background job queue
- **Socket.IO** — real-time communication

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Astro + React)              │
│       Chat UI  │  Dashboard  │  Logs  │  Settings       │
└───────────────────────┬─────────────────────────────────┘
                        │ WebSocket + REST API
┌───────────────────────▼─────────────────────────────────┐
│                  BACKEND (Fastify + TypeScript)          │
│     Auth  │  Chat Router  │  Agent Orchestrator         │
└─────┬─────────┬──────────────┬───────────────┬──────────┘
      │         │              │               │
   Gemini    Supabase       BullMQ       Tool System
   2.5 API   (PostgreSQL)   + Redis    ┌────┬────┬────┐
                                       │GDrive│Tele│ WA │
                                       └────┴────┴────┘
```

## 📁 Project Structure

```
boba-agent/
├── apps/
│   ├── api/                  # 🔧 Backend — Fastify + TypeScript
│   │   ├── src/
│   │   │   ├── agent/        #    AI Agent & Orchestrator
│   │   │   ├── db/           #    Database schema & migrations
│   │   │   ├── middleware/   #    Auth, rate limit, logger
│   │   │   ├── queue/        #    BullMQ job processors
│   │   │   ├── routes/       #    API endpoints
│   │   │   ├── services/     #    Business logic & integrations
│   │   │   ├── utils/        #    Helper utilities
│   │   │   ├── websocket/    #    Socket.IO handlers
│   │   │   └── index.ts      #    Entry point
│   │   └── drizzle.config.ts
│   │
│   └── web/                  # 🎨 Frontend — Astro + React + Tailwind
│       ├── src/
│       ├── public/
│       └── astro.config.mjs
│
├── packages/
│   ├── shared-types/         # 📦 Shared TypeScript type definitions
│   └── shared-utils/         # 📦 Shared utility functions
│
├── docs/
│   ├── plan.md               # 📋 Full planning document
│   └── setup.md              # 📋 Local setup guide
│
├── .env.example              # 🔑 Environment variables template
├── turbo.json                # ⚙️ Turborepo config
├── package.json              # ⚙️ Root workspace config
└── LICENSE                   # 📄 MIT License
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>= 22.12.0`
- **PostgreSQL** `>= 15`
- **Redis** `>= 7` (optional, for background jobs)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<username>/boba-agent.git
cd boba-agent

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# → Edit both .env files with your actual values

# 4. Setup database
psql -U postgres -c "CREATE DATABASE boba_agent;"
cd apps/api
npx drizzle-kit generate
npx drizzle-kit migrate
cd ../..

# 5. Run!
npm run dev
```

| Service | URL |
|---------|-----|
| 🔧 API Server | `http://localhost:3001` |
| 🎨 Web Frontend | `http://localhost:4321` |

> 📖 Full setup guide: [docs/setup.md](./docs/setup.md)

## 🔑 Environment Variables

See the complete templates in:

| File | Description |
|------|-------------|
| [`.env.example`](./.env.example) | Global template (reference) |
| [`apps/api/.env.example`](./apps/api/.env.example) | Backend — Database, JWT, Gemini, OAuth, Messaging, Redis |
| [`apps/web/.env.example`](./apps/web/.env.example) | Frontend — API URL, WalletConnect |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Astro, React, TypeScript, TailwindCSS v4 |
| **Backend** | Fastify, TypeScript, Socket.IO |
| **AI** | Google Gemini 2.5 Flash |
| **Database** | PostgreSQL (Supabase), Drizzle ORM |
| **Queue** | BullMQ, Redis / Upstash |
| **Auth** | JWT, OAuth2, Web3 Wallet |
| **Monorepo** | Turborepo, npm workspaces |
| **Messaging** | Telegraf.js, @whiskeysockets/baileys |
| **Google APIs** | googleapis (Drive, Docs, Sheets, Gmail, Calendar) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute.

---

<div align="center">

**Built with 🧋 and ❤️**

</div>
