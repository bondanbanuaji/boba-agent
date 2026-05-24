'use client';

import { useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useScrollAnchor } from '@/hooks/useScrollAnchor';
import { MessageBubble } from './MessageBubble';
import { ArrowDown } from 'lucide-react';
import { useChatStream } from '@/hooks/useChatStream';

export function MessageList() {
  const { messages, isStreaming } = useMessages();
  const { sendMessage } = useChatStream();
  const { scrollRef, isAtBottom, checkScroll, scrollToBottom } = useScrollAnchor();

  useEffect(() => {
    if (isStreaming || isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-[var(--bg)]">
        <h2 className="font-chat text-2xl font-semibold italic text-[var(--text-muted)] animate-fade-in">
          Mau ngobrol soal apa hari ini?
        </h2>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-[var(--bg)]">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        role="log"
        aria-live="polite"
        className="h-full overflow-y-auto px-4 md:px-8 py-6 flex flex-col scroll-smooth"
      >
        <div className="mx-auto w-full max-w-3xl flex flex-col">
          {messages.map((msg, index) => {
            const isConsecutive = index > 0 && messages[index - 1].role === msg.role;
            return (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                role={msg.role}
                content={msg.content}
                rawContent={msg.rawContent}
                timestamp={msg.timestamp}
                status={msg.status}
                isConsecutive={isConsecutive}
                onRegenerate={msg.role === 'assistant' ? () => sendMessage(messages[index - 1]?.content || '') : undefined}
              />
            );
          })}
        </div>
      </div>

      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border-[0.5px] border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] shadow-md hover:bg-[var(--hover-surface)] transition-all animate-bounce"
        >
          <ArrowDown size={12} /> Pesan baru
        </button>
      )}
    </div>
  );
}
