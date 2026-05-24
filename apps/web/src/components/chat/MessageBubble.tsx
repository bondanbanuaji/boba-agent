'use client';

import ReactMarkdown from 'react-markdown';
import { MessageActions } from './MessageActions';
import { ThinkingBlock } from './ThinkingBlock';

export interface MessageBubbleProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  rawContent?: {
    imageUrl?: string;
  } | null;
  timestamp: number;
  isConsecutive?: boolean;
  status?: 'sending' | 'streaming' | 'done' | 'error';
  onRegenerate?: () => void;
}

export function MessageBubble({ role, content, timestamp, isConsecutive = false, status, onRegenerate, rawContent }: MessageBubbleProps) {
  const isUser = role === 'user';
  
  // Extract thinking block (between <think> and </think>)
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
  const thinkContent = thinkMatch ? thinkMatch[1].trim() : null;
  const mainContent = thinkMatch ? content.replace(/<think>[\s\S]*?<\/think>/, '').trim() : content;

  return (
    <div
      className={`group relative flex flex-col max-w-[85%] transition-all ${
        isUser ? 'self-end items-end' : 'self-start items-start'
      } ${isConsecutive ? 'mt-1' : 'mt-4'}`}
    >
      {!isUser && thinkContent && (
        <div className="w-full">
          <ThinkingBlock>{thinkContent}</ThinkingBlock>
        </div>
      )}

      {!isUser && !mainContent && !thinkContent && status === 'streaming' && (
        <div className="relative rounded-2xl px-4 py-3 border-[0.5px] border-[var(--border)] bg-[var(--ai-bubble)] text-[var(--ai-text)] rounded-bl-sm flex items-center gap-1.5 min-w-[56px] justify-center h-9">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" />
        </div>
      )}

      {mainContent && (
        <div
          className={`relative rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed transition-shadow duration-200 hover:shadow-sm ${
            isUser
              ? 'bg-[var(--user-bubble)] text-[var(--user-text)] rounded-br-sm'
              : 'border-[0.5px] border-[var(--border)] bg-[var(--ai-bubble)] text-[var(--ai-text)] rounded-bl-sm'
          } ${status === 'error' ? 'border-red-500 bg-red-500/5' : ''}`}
        >
          {rawContent?.imageUrl && (
            <div className="mb-2 max-w-[240px] rounded-lg overflow-hidden border-[0.5px] border-[var(--border)]/30 bg-black/10">
              <img src={rawContent.imageUrl} alt="Attached photo" className="w-full h-auto object-contain max-h-[160px] rounded-md" />
            </div>
          )}
          {isUser ? (
            <p className="whitespace-pre-wrap">{mainContent}</p>
          ) : (
            <div className={`prose prose-sm dark:prose-invert font-chat break-words max-w-none ${status === 'streaming' ? 'streaming-container' : ''}`}>
              <ReactMarkdown>
                {mainContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* Timestamp on Hover */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 text-[10px] text-[var(--text-muted)] font-mono">
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>

      {/* Actions Toolbar on Hover */}
      {status !== 'streaming' && mainContent && (
        <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden md:block w-max max-w-sm right-[calc(100%+8px)] left-auto group-hover:block">
          <MessageActions
            content={mainContent}
            onRegenerate={!isUser && onRegenerate ? onRegenerate : undefined}
          />
        </div>
      )}
    </div>
  );
}
