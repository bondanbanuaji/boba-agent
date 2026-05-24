'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, type Message } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useChatStream() {
  const store = useChatStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;
    let sessionId = store.activeSessionId;
    const isNew = !sessionId;

    if (isNew) {
      sessionId = store.createSession(content.slice(0, 30) || "Analisis Gambar");
      router.push(`/chat?id=${sessionId}`);
    }

    const userMsg: Message = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      content, 
      rawContent: imageUrl ? { imageUrl } : null,
      timestamp: Date.now(), 
      status: 'done' 
    };
    const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: Date.now(), status: 'streaming' };

    store.addMessage(sessionId!, userMsg);
    store.addMessage(sessionId!, aiMsg);
    store.setStreaming(true);

    abortControllerRef.current = new AbortController();
    try {
      // Use useChatStore.getState() to get absolute up-to-date messages and exclude the newly added empty assistant message at the end
      const latestMessages = useChatStore.getState().messages[sessionId!] || [];
      const history = latestMessages
        .slice(0, -1)
        .map(m => ({ role: m.role, content: m.content, rawContent: m.rawContent }));
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = useAuthStore.getState().session?.access_token;
      
      const res = await fetch(`${apiUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId: sessionId, messages: history }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Streaming failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Concatenate new chunk bytes decoded into UTF-8 text with streaming flag set to true
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last (possibly incomplete) line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            let data;
            try {
              data = JSON.parse(dataStr);
            } catch (jsonErr) {
              console.error('Failed to parse streaming line JSON:', trimmed, jsonErr);
              continue;
            }

            if (data.content) {
              aiContent += data.content;
              store.updateLastMessage(sessionId!, { content: aiContent });
            } else if (data.error) {
              throw new Error(data.error);
            }
          }
        }
      }
      store.updateLastMessage(sessionId!, { status: 'done' });
      // Invalidate React Query cache so it stays in sync with backend database
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(sessionId!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        store.updateLastMessage(sessionId!, { content: `⚠️ Gagal: ${err.message}`, status: 'error' });
      }
    } finally {
      store.setStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      if (store.activeSessionId) {
        store.updateLastMessage(store.activeSessionId, { status: 'done' });
      }
      store.setStreaming(false);
    }
  };

  return { sendMessage, stopStreaming, isStreaming: store.isStreaming };
}
