'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chatStore';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('id');
  const { setActiveSessionId, sessions } = useChatStore();

  useEffect(() => {
    if (sessionId) {
      const exists = sessions.some((s) => s.id === sessionId);
      if (exists) {
        setActiveSessionId(sessionId);
      } else {
        router.replace('/chat');
        setActiveSessionId(null);
      }
    } else {
      setActiveSessionId(null);
    }
  }, [sessionId, sessions, setActiveSessionId, router]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--bg)]">
      <MessageList />
      <ChatInput />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-[var(--bg)]" />}>
      <ChatContent />
    </Suspense>
  );
}
