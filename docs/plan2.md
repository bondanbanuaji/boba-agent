````md id="a9k4uq"
# LOCAL SETUP PLAN HERMES + 9ROUTER + WEB DASHBOARD

Goal:
- Semua jalan di LOCAL PC
- Tidak pakai VPS
- Tidak pakai Telegram
- Web dashboard jadi chat interface
- Cocok buat development/testing awal

Arsitektur:

Browser
↓
Frontend Dashboard
↓
Backend API
↓
Hermes Runtime
↓
9Router
↓
NVIDIA NIM

Semua jalan di localhost.

---

# SYSTEM REQUIREMENTS

OS:
- Windows 10/11
atau
- Ubuntu

Recommended:
- RAM 16GB
- Node.js 22
- Git
- VSCode

---

# FINAL LOCAL PORTS

```txt id="4m8q0m"
Frontend     : localhost:3000
Backend API  : localhost:3001
9Router      : localhost:20128
````

---

# STEP 1 INSTALL NODE.JS

Download:
[Node.js Official Website](https://nodejs.org/en?utm_source=chatgpt.com)

Install:

```txt id="d9m92s"
Node.js 22 LTS
```

Verify:

```bash id="5z9hpr"
node -v
npm -v
```

---

# STEP 2 CREATE MAIN PROJECT

```bash id="mj0c2k"
mkdir ai-local-platform

cd ai-local-platform
```

Structure:

```txt id="1fhn7x"
/ai-local-platform
  /frontend
  /backend
```

---

# STEP 3 INSTALL 9ROUTER

Global install:

```bash id="o8b6nq"
npm install -g 9router
```

Run:

```bash id="dtik32"
9router
```

9Router dashboard:

```txt id="ks8t6o"
http://localhost:20128
```

Create admin password.

KEEP THIS TERMINAL OPEN.

---

# STEP 4 CONNECT NVIDIA NIM

Get API key:
[NVIDIA Build Portal](https://build.nvidia.com/explore/discover?utm_source=chatgpt.com)

Dashboard:

```txt id="5ahf8l"
http://localhost:20128
```

Add provider:

Name:

```txt id="kbb32t"
NVIDIA
```

Prefix:

```txt id="87d8mn"
nvidia
```

Base URL:

```txt id="ewsq0z"
https://integrate.api.nvidia.com/v1
```

API Type:

```txt id="q0mqqm"
chat
```

API Key:

```txt id="whsy40"
nvapi-xxxxxxxx
```

Save.

---

# STEP 5 CREATE 9ROUTER API KEY

Dashboard:

```txt id="k0wqz8"
Settings
→ API Keys
→ Create Key
```

Save:

```txt id="6u2m4v"
sk-xxxxxxxx
```

This will be used by backend.

---

# STEP 6 CREATE BACKEND

```bash id="0yq0tp"
cd ai-local-platform

mkdir backend

cd backend

npm init -y
```

Install dependencies:

```bash id="lrzysc"
npm install \
express \
cors \
dotenv \
openai \
nodemon
```

Create structure:

```bash id="7pkmlt"
mkdir src

touch src/server.js

touch .env
```

---

# STEP 7 BACKEND ENV

File:

```txt id="wy3lx7"
backend/.env
```

Content:

```env id="hl4fr7"
PORT=3001

OPENAI_API_KEY=sk-xxxxxxxx

OPENAI_BASE_URL=http://localhost:20128/v1

DEFAULT_MODEL=meta-llama/llama-3.3-70b-instruct
```

---

# STEP 8 BACKEND SERVER

File:

```txt id="3r90jc"
backend/src/server.js
```

Paste:

```js id="9n3c2w"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body

    const completion =
      await client.chat.completions.create({
        model: process.env.DEFAULT_MODEL,
        messages,
      })

    res.json(completion)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: err.message,
    })
  }
})

app.listen(process.env.PORT, () => {
  console.log(
    `Backend running on ${process.env.PORT}`
  )
})
```

---

# STEP 9 ENABLE ESM

Edit:

```txt id="lql1o8"
backend/package.json
```

Add:

```json id="jvkkv2"
"type": "module"
```

Example:

```json id="8fr3ls"
{
  "name": "backend",
  "type": "module"
}
```

---

# STEP 10 RUN BACKEND

```bash id="5knv2j"
cd backend

node src/server.js
```

Expected:

```txt id="v1okas"
Backend running on 3001
```

KEEP THIS TERMINAL OPEN.

---

# STEP 11 TEST BACKEND

Open new terminal.

Test:

```bash id="1x9hhn"
curl -X POST http://localhost:3001/api/chat ^
-H "Content-Type: application/json" ^
-d "{\"messages\":[{\"role\":\"user\",\"content\":\"hello\"}]}"
```

Should return AI response JSON.

---

# STEP 12 CREATE FRONTEND

Open new terminal:

```bash id="zq8qij"
cd ai-local-platform

npx create-next-app@latest frontend
```

Select:

```txt id="r1hxhu"
TypeScript → YES
Tailwind → YES
App Router → YES
```

---

# STEP 13 INSTALL FRONTEND DEPENDENCIES

```bash id="jg7j9r"
cd frontend

npm install axios
```

---

# STEP 14 SIMPLE CHAT UI

Replace:

```txt id="d8v7ee"
frontend/src/app/page.tsx
```

With:

```tsx id="4mns2m"
"use client"

import { useState } from "react"
import axios from "axios"

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  async function sendMessage() {
    if (!input) return

    const updated = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ]

    setMessages(updated)

    setInput("")

    const res = await axios.post(
      "http://localhost:3001/api/chat",
      {
        messages: updated,
      }
    )

    const ai =
      res.data.choices[0].message

    setMessages([
      ...updated,
      ai,
    ])
  }

  return (
    <main className="p-10">
      <div className="space-y-4 mb-6">
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 w-full"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
        />

        <button
          className="border px-4"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </main>
  )
}
```

---

# STEP 15 RUN FRONTEND

```bash id="0epr58"
cd frontend

npm run dev
```

Open:

```txt id="9q9z0h"
http://localhost:3000
```

Now your dashboard chat is working locally.

---

# FINAL LOCAL ARCHITECTURE

```txt id="dj6pck"
Browser
↓
Next.js Frontend
↓
Express Backend
↓
9Router
↓
NVIDIA NIM
```

---

# TERMINAL REQUIREMENTS

You need 3 running terminals:

TERMINAL 1:

```bash id="j03v9u"
9router
```

TERMINAL 2:

```bash id="lz0jlwm"
cd backend
node src/server.js
```

TERMINAL 3:

```bash id="t7oqvs"
cd frontend
npm run dev
```

---

# OPTIONAL NEXT UPGRADE

Recommended next steps:

* streaming response
* markdown rendering
* code syntax highlighting
* sidebar chat history
* multi-session chat
* authentication
* file upload
* image upload
* voice input
* vector database memory
* local Ollama models
* agent tools
* shell execution
* browser automation

---

# OPTIONAL LOCAL MODELS

Later you can add:

[Ollama Official Website](https://ollama.com/?utm_source=chatgpt.com)

Flow:

```txt id="h4p0vw"
Frontend
↓
Backend
↓
9Router
↓
Ollama Local Models
```

Benefits:

* fully offline
* no API cost
* local inference

Recommended models:

* qwen3
* llama3
* deepseek-r1
* gemma3

---

# IMPORTANT

For LOCAL development:

* no nginx needed
* no PM2 needed
* no domain needed
* no SSL needed
* no cloudflare needed

Keep everything localhost first.

After stable:

* deploy to VPS later
* add docker later
* add auth later
* add production infra later

```
```
