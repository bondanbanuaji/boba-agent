import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  rawContent?: {
    imageUrl?: string;
  } | null;
  timestamp: number;
  status?: 'sending' | 'streaming' | 'done' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatState {
  sessions: ChatSession[];
  messages: Record<string, Message[]>;
  activeSessionId: string | null;
  isLoading: boolean;
  isStreaming: boolean;

  setSessions: (sessions: ChatSession[]) => void;
  setMessages: (sessionId: string, messages: Message[]) => void;
  setActiveSessionId: (id: string | null) => void;
  createSession: (title?: string) => string;
  deleteSession: (id: string) => void;
  updateSessionTitle: (id: string, title: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateLastMessage: (sessionId: string, update: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  messages: {},
  activeSessionId: null,
  isLoading: false,
  isStreaming: false,

  setSessions: (sessions) => set({ sessions }),
  
  setMessages: (sessionId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [sessionId]: msgs },
    })),

  setActiveSessionId: (id) => set({ activeSessionId: id }),

  createSession: (title = 'Obrolan Baru') => {
    const id = crypto.randomUUID();
    const newSession: ChatSession = {
      id,
      title,
      createdAt: Date.now(),
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      messages: { ...state.messages, [id]: [] },
      activeSessionId: id,
    }));
    return id;
  },

  deleteSession: (id) =>
    set((state) => {
      const { [id]: _, ...remainingMessages } = state.messages;
      const remainingSessions = state.sessions.filter((s) => s.id !== id);
      const nextActiveId =
        state.activeSessionId === id
          ? remainingSessions[0]?.id || null
          : state.activeSessionId;

      return {
        sessions: remainingSessions,
        messages: remainingMessages,
        activeSessionId: nextActiveId,
      };
    }),

  updateSessionTitle: (id, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, title } : s)),
    })),

  addMessage: (sessionId, message) =>
    set((state) => {
      const currentMessages = state.messages[sessionId] || [];
      return {
        messages: {
          ...state.messages,
          [sessionId]: [...currentMessages, message],
        },
      };
    }),

  updateLastMessage: (sessionId, update) =>
    set((state) => {
      const currentMessages = state.messages[sessionId] || [];
      if (currentMessages.length === 0) return {};
      const lastIndex = currentMessages.length - 1;
      const updatedMessages = [...currentMessages];
      updatedMessages[lastIndex] = {
        ...updatedMessages[lastIndex],
        ...update,
      };
      return {
        messages: {
          ...state.messages,
          [sessionId]: updatedMessages,
        },
      };
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
}));
