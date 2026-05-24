'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChatStore } from '@/stores/chatStore';
import { queryKeys } from '@/lib/query-keys';
import { api } from '@/lib/api';

export function useMessages() {
  const { messages, activeSessionId, isStreaming, setMessages } = useChatStore();
  const currentMessages = activeSessionId ? messages[activeSessionId] || [] : [];

  // Fetch messages from backend when activeSessionId changes
  const { data: fetchedMessages, isLoading } = useQuery({
    queryKey: queryKeys.messages(activeSessionId || ''),
    queryFn: async () => {
      if (!activeSessionId) return [];
      const res = await api.get(`/api/chat/history/${activeSessionId}`);
      return res.data || [];
    },
    enabled: !!activeSessionId,
    refetchOnWindowFocus: false,
  });

  // Sync fetched messages into the Zustand store
  useEffect(() => {
    if (activeSessionId && fetchedMessages && !isStreaming) {
      const currentMessages = useChatStore.getState().messages[activeSessionId] || [];
      // Only load from backend history if the local store is currently empty for this session
      if (currentMessages.length === 0 && fetchedMessages.length > 0) {
        setMessages(activeSessionId, fetchedMessages);
      }
    }
  }, [fetchedMessages, activeSessionId, isStreaming, setMessages]);

  return {
    messages: currentMessages,
    activeSessionId,
    isStreaming,
    isLoading,
  };
}
