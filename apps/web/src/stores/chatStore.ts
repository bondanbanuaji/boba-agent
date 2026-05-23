import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'streaming' | 'done' | 'error';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;

  // Getters
  getActiveConversation: () => Conversation | undefined;
  getActiveMessages: () => Message[];

  // Actions
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  addMessage: (msg: Message) => void;
  appendToLastMessage: (chunk: string) => void;
  updateMessageStatus: (id: string, status: Message['status']) => void;
  setStreaming: (streaming: boolean) => void;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isStreaming: false,

  getActiveConversation: () => {
    const state = get();
    return state.conversations.find(c => c.id === state.activeConversationId);
  },

  getActiveMessages: () => {
    const conv = get().getActiveConversation();
    return conv?.messages || [];
  },

  createConversation: () => {
    const id = crypto.randomUUID();
    const conv: Conversation = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    set(state => ({
      conversations: [conv, ...state.conversations],
      activeConversationId: id,
    }));
    return id;
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (msg) => set(state => {
    const convId = state.activeConversationId;
    if (!convId) return state;
    return {
      conversations: state.conversations.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, msg],
              title: c.messages.length === 0 && msg.role === 'user'
                ? msg.content.slice(0, 40) + (msg.content.length > 40 ? '...' : '')
                : c.title,
            }
          : c
      ),
    };
  }),

  appendToLastMessage: (chunk) => set(state => {
    const convId = state.activeConversationId;
    if (!convId) return state;
    return {
      conversations: state.conversations.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map((m, i) =>
                i === c.messages.length - 1
                  ? { ...m, content: m.content + chunk }
                  : m
              ),
            }
          : c
      ),
    };
  }),

  updateMessageStatus: (id, status) => set(state => ({
    conversations: state.conversations.map(c => ({
      ...c,
      messages: c.messages.map(m => m.id === id ? { ...m, status } : m),
    })),
  })),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  deleteConversation: (id) => set(state => {
    const filtered = state.conversations.filter(c => c.id !== id);
    return {
      conversations: filtered,
      activeConversationId: state.activeConversationId === id
        ? (filtered[0]?.id || null)
        : state.activeConversationId,
    };
  }),

  clearAll: () => set({ conversations: [], activeConversationId: null }),
}));
