const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function sendChatMessage(messages: { role: string; content: string }[]) {
  const res = await fetch(`${API_URL}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}

export async function streamChatMessage(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
) {
  try {
    const res = await fetch(`${API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) throw new Error('Stream request failed');

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No reader available');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) onChunk(parsed.content);
            if (parsed.error) onError(parsed.error);
          } catch {}
        }
      }
    }
    onDone();
  } catch (error: any) {
    onError(error.message);
  }
}

export async function fetchAgentStatus() {
  try {
    const res = await fetch(`${API_URL}/api/agent/status`);
    return res.json();
  } catch {
    return { status: 'disconnected' };
  }
}

export async function fetchIntegrationStatus() {
  try {
    const res = await fetch(`${API_URL}/api/integrations/status`);
    return res.json();
  } catch {
    return { google: false, telegram: false, whatsapp: false };
  }
}
