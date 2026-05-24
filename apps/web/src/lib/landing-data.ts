import { MessageSquare, Zap, Shield } from 'lucide-react';
import type { ComponentType } from 'react';

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  Icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
}

export const STATS: StatItem[] = [
  { value: '< 1s', label: 'rata-rata respons' },
  { value: '3×', label: 'lebih cepat dari rata-rata' },
  { value: '100%', label: 'data tetap di sisi kamu' },
];

export const MARQUEE_ITEMS: string[] = [
  'Streaming Realtime',
  'Gemini 2.5 Flash',
  'Integrasi Telegram',
  'WhatsApp Ready',
  'Gmail & Drive',
  'Context Memory',
  'Tool Calling',
  'Markdown Render',
];

export const FEATURES: FeatureItem[] = [
  {
    Icon: MessageSquare,
    title: 'Ngerti konteks percakapan',
    description:
      'Bukan chatbot yang lupa obrolan sebelumnya. BobaAgent nyimpen konteks dan jawab sesuai situasi.',
  },
  {
    Icon: Zap,
    title: 'Respons streaming instan',
    description:
      'Token muncul real-time lewat WebSocket. Tidak ada loading screen, tidak ada tunggu-tunggu.',
  },
  {
    Icon: Shield,
    title: 'Data lo, kontrol lo',
    description:
      'Semua riwayat chat tersimpan di database kamu sendiri. Tidak ada yang dikirim ke pihak ketiga.',
  },
];

export const CHAT_PREVIEW_MESSAGES = [
  { role: 'user' as const, text: 'Ringkas email dari Gmail gua hari ini dong' },
  {
    role: 'ai' as const,
    text: 'Oke. 3 email masuk hari ini. 1 dari klien soal revisi desain, 1 notif Supabase, 1 newsletter yang bisa diabaikan. Yang penting cuma yang pertama.',
  },
  { role: 'user' as const, text: 'Draft balasannya sekalian' },
];
