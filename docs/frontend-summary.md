# Frontend Overview: BOBA-AGENT

This document provides a technical summary of the frontend architecture for the BOBA-AGENT project.

## 🏗️ Architecture
The frontend is built using **Astro** for high-performance delivery, paired with **React** for interactive, stateful components. It operates as a personal AI command center, communicating with the Fastify backend via **WebSockets** for real-time streaming AI responses and **REST APIs** for resource management.

### Key Technologies
- **Framework:** [Astro](https://astro.build/) (SSR/SSG)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [TailwindCSS v4](https://tailwindcss.com/) (Utility-first) + [DaisyUI](https://daisyui.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Global state) + [@tanstack/react-query](https://tanstack.com/query/latest) (Server state)
- **Interactive Visuals:** [Three.js](https://threejs.org/) (Hero animations) + [Framer Motion](https://www.framer.com/motion/) (UI transitions)
- **Markdown Rendering:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)

## 📂 Project Structure (`apps/web/`)
- `src/app/`: Core layouts, globals, and routing.
- `src/components/`: Modular UI units (chat bubbles, dashboard widgets, integration cards).
- `src/stores/`: Zustand stores for Chat (`chatStore.ts`) and Auth (`authStore.ts`).
- `src/lib/`: API client instances and helper utilities.
- `src/app/globals.css`: Centralized design system enforcing 0.5px borders, specific border radii, and token-based color system.

## 🎨 Design System
The UI adheres to a strict flat-surface aesthetic:
- **Colors:** Managed via CSS tokens (`--bg`, `--surface`, `--accent`, etc.) supporting light/dark modes.
- **Borders:** Fixed at `0.5px`.
- **Radii:** `8px` (input/small), `12px` (bubbles), `14px` (shell/main containers).
- **Typography:**
  - **Body Text:** 'Lora' (Serif) for readability.
  - **UI Elements:** 'DM Sans' (Sans-serif) for clarity.
  - **Code Blocks:** 'JetBrains Mono' (Monospace).
- **Theme:** Managed via `next-themes` with manual persistence in `localStorage`.

## 🚀 Chat Interface Implementation
- **Streaming:** Handles real-time tokens via WebSocket `chat:stream:token`.
- **Tool Execution:** Visualizes AI-triggered actions (e.g., file search, API requests) using `ActionBadge` and `ToolCallCard`.
- **Memory:** Contextual awareness managed by the backend, rendered dynamically through the markdown interface.
