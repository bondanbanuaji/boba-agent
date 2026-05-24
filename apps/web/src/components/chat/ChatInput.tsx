'use client';

import { useState, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useAutoResize } from '@/hooks/useAutoResize';
import { useChatStream } from '@/hooks/useChatStream';
import { useAuthStore } from '@/stores/authStore';
import { Paperclip, Send, Square, X, Camera, Loader2 } from 'lucide-react';

export function ChatInput() {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useAutoResize(text);
  const { sendMessage, stopStreaming, isStreaming } = useChatStream();

  const handleSend = () => {
    if (!text.trim() && !imagePreview) return;
    sendMessage(text, imagePreview || undefined);
    setText('');
    setImagePreview(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const uploadBase64Image = async (base64String: string, originalName: string) => {
    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = useAuthStore.getState().session?.access_token;

      const res = await fetch(`${apiUrl}/api/chat/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image: base64String,
          filename: originalName
        })
      });

      if (!res.ok) throw new Error('Gagal mengunggah foto');
      const data = await res.json();
      if (data.url) {
        setImagePreview(data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengunggah gambar. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      if (base64String) {
        await uploadBase64Image(base64String, file.name);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    for (const item of Array.from(items || [])) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64String = event.target?.result as string;
            if (base64String) {
              await uploadBase64Image(base64String, 'pasted-screenshot.png');
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <div className="border-t-[0.5px] border-[var(--border)] bg-[var(--surface)] p-4 relative">
      {/* Hidden file input */}
      <input 
        type="file" 
        id="photo-upload-input" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <div className="mx-auto max-w-3xl flex flex-col gap-2">
        {/* Loading overlay for upload */}
        {uploading && (
          <div className="flex items-center gap-2 self-start rounded-lg border-[0.5px] border-[var(--border)] px-3 py-1.5 bg-[var(--bg)] text-xs text-[var(--text-muted)] animate-pulse">
            <Loader2 size={12} className="animate-spin text-[var(--accent)]" />
            <span>Mengunggah foto...</span>
          </div>
        )}

        {imagePreview && !uploading && (
          <div className="relative self-start rounded-lg border-[0.5px] border-[var(--border)] p-1 bg-[var(--bg)]">
            <img src={imagePreview} alt="Upload preview" className="max-h-20 rounded object-contain" />
            <button onClick={() => setImagePreview(null)} className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 text-white p-0.5 shadow hover:bg-red-600 transition-colors">
              <X size={10} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--bg)] px-3 py-2 relative">
          
          {/* Paperclip button with beautiful floating dropdown */}
          <div className="relative flex items-center">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className={`hover:text-[var(--text-primary)] transition-colors p-1 rounded-md ${menuOpen ? 'text-[var(--text-primary)] bg-white/5' : 'text-[var(--text-muted)]'}`} 
              title="Lampirkan File"
            >
              <Paperclip size={18} />
            </button>
            
            {menuOpen && (
              <>
                {/* Click outside overlay */}
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                
                {/* Premium floating dropdown mimicking fituraddphoto.png with dynamic theme variables */}
                <div className="absolute bottom-10 left-0 z-50 min-w-[200px] rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-2xl animate-fade-in text-[var(--text-primary)] font-sans text-xs flex flex-col gap-0.5">
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      document.getElementById('photo-upload-input')?.click();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-[var(--hover-surface)] transition-colors"
                  >
                    <Paperclip size={14} className="text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--text-primary)]/90">Add files or photos</span>
                  </button>
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      document.getElementById('photo-upload-input')?.click();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-[var(--hover-surface)] transition-colors"
                  >
                    <Camera size={14} className="text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--text-primary)]/90">Take a screenshot</span>
                  </button>
                </div>
              </>
            )}
          </div>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={uploading ? "Menunggu unggahan selesai..." : "Tanya BobaAgent..."}
            disabled={uploading}
            className="flex-1 bg-transparent py-1 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none max-h-[160px] disabled:opacity-50"
          />

          {isStreaming ? (
            <button onClick={stopStreaming} className="rounded-lg bg-red-500 text-white p-2 hover:bg-red-600 transition-colors" title="Hentikan">
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button 
              onClick={handleSend} 
              disabled={(!text.trim() && !imagePreview) || uploading} 
              className="rounded-lg bg-[var(--accent)] text-white p-2 hover:opacity-90 disabled:opacity-40 transition-all" 
              title="Kirim"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
