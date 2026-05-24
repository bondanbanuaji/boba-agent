'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '@/stores/chatStore';
import { queryKeys } from '@/lib/query-keys';
import { api } from '@/lib/api';

export function useSessionList() {
  const queryClient = useQueryClient();
  const { sessions, activeSessionId, setSessions, setActiveSessionId, updateSessionTitle, deleteSession } = useChatStore();

  // Fetch all sessions from backend Drizzle DB
  const { data: fetchedSessions, isLoading } = useQuery({
    queryKey: queryKeys.sessions,
    queryFn: async () => {
      const res = await api.get('/api/chat/sessions');
      return res.data || [];
    },
    refetchOnWindowFocus: false,
  });

  // Sync fetched sessions into Zustand store
  useEffect(() => {
    if (fetchedSessions) {
      setSessions(fetchedSessions);
    }
  }, [fetchedSessions, setSessions]);

  // Mutations to keep backend in sync
  const deleteSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/chat/sessions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      await api.put(`/api/chat/sessions/${id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });

  const handleDeleteSession = (id: string) => {
    deleteSession(id); // Local optimistic delete
    deleteSessionMutation.mutate(id); // Backend delete
  };

  const handleUpdateSessionTitle = (id: string, title: string) => {
    updateSessionTitle(id, title); // Local optimistic update
    updateTitleMutation.mutate({ id, title }); // Backend update
  };

  return {
    sessions,
    activeSessionId,
    createSession: (title?: string) => {
      const id = useChatStore.getState().createSession(title);
      // Notify backend immediately to create it in DB
      api.post('/api/chat/sessions', { id, title }).then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
      }).catch(err => {
        console.error('Failed to sync session creation with backend:', err);
      });
      return id;
    },
    deleteSession: handleDeleteSession,
    setActiveSessionId,
    updateSessionTitle: handleUpdateSessionTitle,
    isLoading,
  };
}
