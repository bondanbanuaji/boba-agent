# 🚀 BOBA-AGENT — Panduan Setup Lokal

> Langkah demi langkah untuk menjalankan **boba-agent** di mesin lokal kamu.

---

## 📋 Daftar Isi

1. [Prerequisites](#1-prerequisites)
2. [Clone Repository](#2-clone-repository)
3. [Install Dependencies](#3-install-dependencies)
4. [Setup Environment Variables](#4-setup-environment-variables)
5. [Setup Database (PostgreSQL / Supabase)](#5-setup-database)
6. [Setup Redis (BullMQ / Upstash)](#6-setup-redis)
7. [Setup External Services](#7-setup-external-services)
8. [Menjalankan Project](#8-menjalankan-project)
9. [Verifikasi Instalasi](#9-verifikasi-instalasi)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Pastikan semua software berikut sudah terinstall di mesin kamu:

| Software | Versi Minimum | Cara Cek | Link Download |
|----------|--------------|----------|---------------|
| **Node.js** | `>= 22.12.0` | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | `>= 10.x` | `npm -v` | Sudah termasuk di Node.js |
| **Git** | `>= 2.x` | `git --version` | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | `>= 15.x` | `psql --version` | [postgresql.org](https://www.postgresql.org/download/) |
| **Redis** | `>= 7.x` (opsional) | `redis-cli ping` | [redis.io](https://redis.io/download/) |

> [!IMPORTANT]
> Node.js versi **22.12.0 atau lebih baru** wajib digunakan. Cek versimu dengan `node -v`.

---

## 2. Clone Repository

```bash
git clone https://github.com/<username>/boba-agent.git
cd boba-agent
```

---

## 3. Install Dependencies

Project ini menggunakan **npm workspaces** + **Turborepo** sebagai monorepo manager. Cukup jalankan `npm install` di root — semua dependencies (API, Web, dan packages) akan otomatis terinstall.

```bash
npm install
```

Ini akan menginstall dependencies untuk:
- `apps/api` — Backend Fastify
- `apps/web` — Frontend Astro + React
- `packages/shared-types` — Shared TypeScript types
- `packages/shared-utils` — Shared utility functions

> [!NOTE]
> Jangan jalankan `npm install` di masing-masing subfolder. Biarkan npm workspaces yang menanganinya dari root.

---

## 4. Setup Environment Variables

### 4.1 Backend API (`apps/api`)

```bash
cp apps/api/.env.example apps/api/.env
```

Buka `apps/api/.env` dan isi setiap variabel:

```env
# --------------------------------------------------------
# Application Config
# --------------------------------------------------------
PORT="3001"
FRONTEND_URL="http://localhost:4321"

# --------------------------------------------------------
# Database (Supabase / PostgreSQL)
# --------------------------------------------------------
DATABASE_URL="postgresql://postgres:password@localhost:5432/boba_agent"

# --------------------------------------------------------
# Authentication (JWT)
# --------------------------------------------------------
JWT_SECRET="ganti_dengan_random_string_panjang"
JWT_REFRESH_SECRET="ganti_dengan_random_string_lain"

# --------------------------------------------------------
# AI Core (Gemini)
# --------------------------------------------------------
GEMINI_API_KEY="api_key_dari_google_ai_studio"
GEMINI_MODEL="gemini-2.5-flash"

# --------------------------------------------------------
# Google Workspace Integrations (OAuth2)
# --------------------------------------------------------
GOOGLE_CLIENT_ID="dari_google_cloud_console"
GOOGLE_CLIENT_SECRET="dari_google_cloud_console"
GOOGLE_REDIRECT_URI="http://localhost:3001/auth/google/callback"

# --------------------------------------------------------
# Messaging Integrations
# --------------------------------------------------------
TELEGRAM_BOT_TOKEN="dari_botfather_telegram"
TELEGRAM_API_ID="dari_my.telegram.org"
TELEGRAM_API_HASH="dari_my.telegram.org"
WA_SESSION_SECRET="random_secret_string"

# --------------------------------------------------------
# Queue & Caching (Redis)
# --------------------------------------------------------
UPSTASH_REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_TOKEN="kosongkan_jika_lokal"
```

### 4.2 Frontend Web (`apps/web`)

```bash
cp apps/web/.env.example apps/web/.env
```

Buka `apps/web/.env` dan isi:

```env
# --------------------------------------------------------
# Application URLs
# --------------------------------------------------------
PUBLIC_API_URL="http://localhost:3001"

# --------------------------------------------------------
# Web3 Integrations
# --------------------------------------------------------
PUBLIC_WALLETCONNECT_PROJECT_ID="dari_cloud.walletconnect.com"
```

### 4.3 Root `.env` (Opsional)

```bash
cp .env.example .env
```

File root `.env` berisi gabungan semua variabel dan bisa digunakan sebagai referensi global.

> [!CAUTION]
> **JANGAN** pernah commit file `.env` ke GitHub! File `.gitignore` sudah dikonfigurasi untuk mengabaikannya. Yang boleh di-commit hanya `.env.example`.

---

## 5. Setup Database

### Opsi A: PostgreSQL Lokal

1. **Install PostgreSQL** jika belum ada.

2. **Buat database baru:**
   ```bash
   psql -U postgres
   ```
   ```sql
   CREATE DATABASE boba_agent;
   \q
   ```

3. **Update `DATABASE_URL`** di `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password_kamu@localhost:5432/boba_agent"
   ```

4. **Jalankan migrasi database** (Drizzle ORM):
   ```bash
   cd apps/api
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

### Opsi B: Supabase (Cloud)

1. Buat project baru di [supabase.com](https://supabase.com/).
2. Copy connection string dari **Settings → Database → Connection string (URI)**.
3. Paste ke `DATABASE_URL` di `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
   ```
4. Jalankan migrasi:
   ```bash
   cd apps/api
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

---

## 6. Setup Redis

Redis digunakan oleh **BullMQ** untuk background job queue dan caching.

### Opsi A: Redis Lokal

1. **Install Redis:**
   - **Windows:** Gunakan [Memurai](https://www.memurai.com/) atau WSL
   - **macOS:** `brew install redis && brew services start redis`
   - **Linux:** `sudo apt install redis-server && sudo systemctl start redis`

2. **Verifikasi:**
   ```bash
   redis-cli ping
   # Harus menjawab: PONG
   ```

3. **Pastikan `.env` mengarah ke Redis lokal:**
   ```env
   UPSTASH_REDIS_URL="redis://localhost:6379"
   UPSTASH_REDIS_TOKEN=""
   ```

### Opsi B: Upstash (Cloud / Serverless)

1. Buat database di [upstash.com](https://upstash.com/).
2. Copy **REST URL** dan **Token** dari dashboard.
3. Update di `apps/api/.env`:
   ```env
   UPSTASH_REDIS_URL="https://your-endpoint.upstash.io"
   UPSTASH_REDIS_TOKEN="your_upstash_token"
   ```

> [!TIP]
> Untuk development lokal, Redis lokal sudah cukup. Upstash lebih cocok untuk production/staging.

---

## 7. Setup External Services

### 7.1 Google AI Studio (Gemini API)

1. Buka [Google AI Studio](https://aistudio.google.com/).
2. Klik **"Get API Key"** → Create API Key.
3. Paste ke `GEMINI_API_KEY` di `.env`.

### 7.2 Google Cloud Console (OAuth2 untuk Google Workspace)

Diperlukan untuk integrasi Gmail, Google Drive, Docs, Sheets, Calendar.

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru atau pilih yang sudah ada.
3. **Aktifkan API:**
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Gmail API
   - Google Calendar API
4. **Buat OAuth2 Credentials:**
   - Buka **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
5. Copy **Client ID** dan **Client Secret** ke `.env`.

### 7.3 Telegram Bot

1. Buka [BotFather](https://t.me/BotFather) di Telegram.
2. Kirim `/newbot` → ikuti instruksinya.
3. Copy **Bot Token** ke `TELEGRAM_BOT_TOKEN`.
4. Untuk API ID & Hash:
   - Buka [my.telegram.org](https://my.telegram.org/).
   - Login → API Development Tools → Buat app baru.
   - Copy **API ID** dan **API Hash** ke `.env`.

### 7.4 WalletConnect (Web3)

1. Buka [WalletConnect Cloud](https://cloud.walletconnect.com/).
2. Buat project baru.
3. Copy **Project ID** ke `PUBLIC_WALLETCONNECT_PROJECT_ID` di `apps/web/.env`.

> [!NOTE]
> WhatsApp menggunakan **@whiskeysockets/baileys** yang bekerja dengan QR code scan saat pertama kali dijalankan. Tidak perlu API key terpisah.

---

## 8. Menjalankan Project

### 8.1 Jalankan Semua Sekaligus (Recommended)

Dari **root** project:

```bash
npm run dev
```

Ini akan menjalankan **Turborepo** yang otomatis menjalankan semua apps secara paralel:

| Service | URL | Deskripsi |
|---------|-----|-----------|
| **API Server** | `http://localhost:3001` | Backend Fastify |
| **Web Frontend** | `http://localhost:4321` | Frontend Astro |

### 8.2 Jalankan Satu per Satu (Debugging)

**Backend API saja:**
```bash
cd apps/api
npm run dev
```

**Frontend Web saja:**
```bash
cd apps/web
npm run dev
```

### 8.3 Build Production

```bash
npm run build
```

---

## 9. Verifikasi Instalasi

Setelah menjalankan `npm run dev`, pastikan semua berjalan:

### ✅ Cek API Server

```bash
curl http://localhost:3001/health
```

Response yang diharapkan:
```json
{ "status": "ok", "service": "BOBA-AGENT API" }
```

### ✅ Cek Frontend

Buka browser → navigasi ke `http://localhost:4321`

### ✅ Cek Database

```bash
cd apps/api
npx drizzle-kit studio
```

Ini akan membuka **Drizzle Studio** di browser untuk melihat isi database secara visual.

---

## 10. Troubleshooting

### ❌ `npm install` gagal

```
Error: Unsupported engine
```

**Solusi:** Upgrade Node.js ke versi `>= 22.12.0`:
```bash
node -v  # cek versi saat ini
```
Gunakan [nvm](https://github.com/nvm-sh/nvm) untuk mengelola versi Node.js:
```bash
nvm install 22
nvm use 22
```

---

### ❌ Port sudah dipakai

```
Error: listen EADDRINUSE :::3001
```

**Solusi:** Matikan proses yang menggunakan port tersebut, atau ubah port di `.env`:

Windows:
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
lsof -ti:3001 | xargs kill -9
```

---

### ❌ Database connection refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solusi:** Pastikan PostgreSQL sedang berjalan:

Windows:
```powershell
Get-Service -Name postgresql*
```

macOS:
```bash
brew services list | grep postgresql
```

Linux:
```bash
sudo systemctl status postgresql
```

---

### ❌ Redis connection refused

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solusi:** Redis belum berjalan atau belum diinstall. Lihat [Bagian 6](#6-setup-redis) untuk instalasi.

> [!TIP]
> Jika kamu tidak membutuhkan background jobs saat development awal, kamu bisa skip Redis terlebih dahulu. Beberapa fitur queue tidak akan berjalan, tetapi API dan frontend tetap bisa diakses.

---

### ❌ Drizzle migration error

```
Error: relation "xxx" does not exist
```

**Solusi:** Pastikan migrasi sudah dijalankan:
```bash
cd apps/api
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

### ❌ WhatsApp QR code tidak muncul

**Solusi:** Pastikan `WA_SESSION_SECRET` sudah diisi di `.env`. Buka log server untuk melihat QR code, lalu scan dengan WhatsApp kamu.

---

## 📁 Struktur Ringkas Project

```
boba-agent/
├── apps/
│   ├── api/                  # Backend — Fastify + TypeScript
│   │   ├── src/
│   │   │   ├── agent/        # AI Agent & Orchestrator
│   │   │   ├── db/           # Database schema & migrations (Drizzle)
│   │   │   ├── middleware/   # Auth, validation middleware
│   │   │   ├── queue/        # BullMQ job processors
│   │   │   ├── routes/       # API route handlers
│   │   │   ├── services/     # Business logic services
│   │   │   ├── utils/        # Helper utilities
│   │   │   ├── websocket/    # Socket.IO handlers
│   │   │   └── index.ts      # Entry point server
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── web/                  # Frontend — Astro + React + TailwindCSS
│       ├── src/
│       ├── public/
│       ├── astro.config.mjs
│       └── package.json
│
├── packages/
│   ├── shared-types/         # Shared TypeScript type definitions
│   └── shared-utils/         # Shared utility functions
│
├── docs/
│   ├── plan.md               # Full planning document
│   └── setup.md              # 📍 Kamu ada di sini!
│
├── .env.example              # Template environment variables (global)
├── .gitignore
├── package.json              # Root workspace config
└── turbo.json                # Turborepo pipeline config
```

---

## 🎯 Quick Start (TL;DR)

```bash
# 1. Clone
git clone https://github.com/<username>/boba-agent.git && cd boba-agent

# 2. Install
npm install

# 3. Setup env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# → Edit kedua file .env dengan value yang sesuai

# 4. Setup database
psql -U postgres -c "CREATE DATABASE boba_agent;"
cd apps/api && npx drizzle-kit generate && npx drizzle-kit migrate && cd ../..

# 5. Run!
npm run dev

# API  → http://localhost:3001
# Web  → http://localhost:4321
```

---

> **Happy Building! 🧋🤖**