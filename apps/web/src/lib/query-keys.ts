export const queryKeys = {
  sessions: ['sessions'] as const,
  messages: (sessionId: string) => ['messages', sessionId] as const,
  agentStatus: ['agent-status'] as const,
  integrations: ['integrations'] as const,
  logs: (filters?: Record<string, any>) => ['logs', filters] as const,
};
