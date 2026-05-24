'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Settings, Save, ShieldAlert, Check } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [model, setModel] = useState('meta-llama/llama-3.3-70b-instruct');
  const [sound, setSound] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[560px] p-6 space-y-6">
        <div className="skeleton h-12 w-1/3" />
        <div className="skeleton h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto relative mx-auto max-w-[560px] p-6 md:py-10 space-y-8 animate-fade-in pb-24">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <Settings className="text-[var(--accent)]" size={18} />
          <span className="section-label !text-[11px] tracking-widest">Preferensi</span>
        </div>
        <h1 className="font-chat text-3xl font-bold text-[var(--text-primary)]">Pengaturan</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Atur fungsionalitas asisten AI, tema tampilan, dan preferensi akun Anda.
        </p>
      </header>

      <div className="space-y-6">
        {/* Model AI */}
        <section className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <h2 className="font-chat text-base font-bold text-[var(--text-primary)] border-b-[0.5px] border-[var(--border)] pb-2">
            Model AI Utama
          </h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border-[0.5px] border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B</option>
              <option value="google/gemini-flash-1.5">Gemini 1.5 Flash</option>
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
            </select>
          </div>
        </section>

        {/* Tampilan */}
        <section className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <h2 className="font-chat text-base font-bold text-[var(--text-primary)] border-b-[0.5px] border-[var(--border)] pb-2">
            Tema Tampilan
          </h2>
          <div className="flex gap-2">
            {[
              { id: 'light', label: 'Terang' },
              { id: 'dark', label: 'Gelap' },
              { id: 'system', label: 'Sistem' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 py-1.5 rounded-lg border-[0.5px] text-xs font-semibold transition-all ${
                  theme === t.id
                    ? 'bg-[var(--accent)] text-white border-transparent'
                    : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--hover-surface)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Notifikasi */}
        <section className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <h2 className="font-chat text-base font-bold text-[var(--text-primary)] border-b-[0.5px] border-[var(--border)] pb-2">
            Notifikasi Suara
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Aktifkan efek suara chat</span>
            <button
              onClick={() => setSound(!sound)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                sound ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  sound ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Zona Bahaya */}
        <section className="rounded-xl border-[0.5px] border-red-500/30 bg-[var(--surface)] p-5 space-y-4">
          <h2 className="font-chat text-base font-bold text-red-500 flex items-center gap-1.5 border-b-[0.5px] border-red-500/10 pb-2">
            <ShieldAlert size={16} /> Zona Bahaya
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Tindakan di bawah bersifat permanen dan tidak dapat dibatalkan.
          </p>
          <button className="rounded-lg border-[0.5px] border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold px-4 py-2 transition-all">
            Hapus Semua Riwayat Chat
          </button>
        </section>

        <button
          onClick={handleSave}
          className="btn-primary w-full justify-center py-2.5 gap-2"
        >
          <Save size={14} /> Simpan Pengaturan
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border-[0.5px] border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-600 shadow-md animate-fade-in-up">
          <Check size={12} /> Pengaturan berhasil disimpan!
        </div>
      )}
    </div>
  );
}
