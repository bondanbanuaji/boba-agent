"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import { streamChatMessage } from "@/lib/api";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatInterface() {
  const {
    getActiveMessages,
    getActiveConversation,
    activeConversationId,
    isStreaming,
    createConversation,
    addMessage,
    appendToLastMessage,
    updateMessageStatus,
    setStreaming,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = getActiveMessages();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
      status: 'done' as const,
    };
    addMessage(userMsg);

    const assistantId = crypto.randomUUID();
    const assistantMsg = {
      id: assistantId,
      role: 'assistant' as const,
      content: '',
      timestamp: Date.now(),
      status: 'streaming' as const,
    };
    addMessage(assistantMsg);
    setStreaming(true);

    // Build messages array for API
    const conv = useChatStore.getState().getActiveConversation();
    const apiMessages = (conv?.messages || []).filter(m => m.role !== 'system' && m.status !== 'streaming').map(m => ({
      role: m.role,
      content: m.content,
    }));

    await streamChatMessage(
      apiMessages,
      (chunk) => appendToLastMessage(chunk),
      () => {
        updateMessageStatus(assistantId, 'done');
        setStreaming(false);
      },
      (error) => {
        appendToLastMessage(`\n\n⚠️ Error: ${error}`);
        updateMessageStatus(assistantId, 'error');
        setStreaming(false);
      },
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <EmptyState onSuggestion={handleSend} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}

function EmptyState({ onSuggestion }: { onSuggestion: (msg: string) => void }) {
  const suggestions = [
    { icon: '💬', text: 'Explain how AI agents work' },
    { icon: '📧', text: 'Draft an email to my team' },
    { icon: '📊', text: 'Analyze my project structure' },
    { icon: '🔍', text: 'Search my Google Drive' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
      <p className="text-slate-400 mb-8 max-w-md">I'm BOBA AGENT, your personal AI assistant. Ask me anything or try one of these suggestions.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.text)}
            className="glass-card px-4 py-3 text-left text-sm text-slate-300 hover:text-white transition-all hover:scale-[1.02] flex items-center gap-3"
          >
            <span className="text-lg">{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
