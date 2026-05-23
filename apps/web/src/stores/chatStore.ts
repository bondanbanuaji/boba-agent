import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: any[];
  status?: 'sending' | 'processing' | 'running' | 'completed' | 'error';
}

interface ChatState {
  messages: Message[];
  addMessage: (msg: Message) => void;
  updateMessageStatus: (id: string, status: Message['status']) => void;
  appendStreamToMessage: (id: string, chunk: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateMessageStatus: (id, status) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, status } : m)
  })),
  appendStreamToMessage: (id, chunk) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, content: m.content + chunk } : m)
  }))
}));
