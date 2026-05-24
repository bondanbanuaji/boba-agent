'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionList } from '@/hooks/useSessionList';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { Plus, Search, Trash2, Edit2, Check, LayoutDashboard, Cpu, Terminal, Settings, LogOut, ChevronRight } from 'lucide-react';

export function SessionSidebar() {
  const router = useRouter();
  const { sessions, activeSessionId, deleteSession, setActiveSessionId, updateSessionTitle } = useSessionList() as any;
  const { updateSessionTitle: storeUpdate } = useChatStore();
  const { user, signOut } = useAuthStore();
  
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const filteredSessions = sessions.filter((s: any) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'boobaax';

  const handleNewChat = () => {
    setActiveSessionId(null);
    router.push('/chat');
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
    if (id === activeSessionId) {
      router.push('/chat');
    }
  };

  return (
    <div className="relative flex h-full w-[240px] flex-col border-r-[0.5px] border-[var(--border)] bg-[var(--sidebar)]">
      {/* Top Header & Actions */}
      <div className="p-4 flex flex-col gap-3">
        <button onClick={handleNewChat} className="btn-primary w-full justify-center gap-2">
          <Plus size={16} /> Chat Baru
        </button>
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari chat..."
            className="w-full rounded-lg border-[0.5px] border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* Recents Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Recents
        </div>
        {filteredSessions.map((session: any) => {
          const isActive = session.id === activeSessionId;
          const isEditing = session.id === editingId;

          return (
            <div
              key={session.id}
              className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--hover-surface)] ${
                isActive ? 'bg-[var(--hover-surface)] text-[var(--accent)]' : 'text-[var(--text-primary)]'
              }`}
            >
              {isEditing ? (
                <div className="flex flex-1 items-center gap-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 rounded border-[0.5px] border-[var(--border)] bg-[var(--surface)] px-1 py-0.5 text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                  <button onClick={() => { (storeUpdate || updateSessionTitle)(session.id, editTitle); setEditingId(null); }} className="text-green-600">
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => router.push(`/chat?id=${session.id}`)} className="flex-1 text-left truncate pr-2">
                  {session.title}
                </button>
              )}
              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(session.id); setEditTitle(session.title); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(session.id)} className="text-[var(--text-muted)] hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Profile Popover Menu */}
      {showProfileMenu && (
        <div className="absolute bottom-[72px] left-3 right-3 z-50 flex flex-col rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 px-3 py-2 border-b-[0.5px] border-[var(--border)]/60">
            <div className="h-7 w-7 rounded-full bg-[var(--accent)] flex items-center justify-center font-chat text-xs font-bold text-white uppercase">
              {userDisplayName.slice(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">{userDisplayName}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">Free Plan</span>
            </div>
          </div>
          
          <nav className="flex flex-col gap-0.5 mt-1">
            <Link href="/dashboard" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--hover-surface)] transition-colors">
              <LayoutDashboard size={14} className="text-[var(--text-muted)]" /> Dasbor
            </Link>
            <Link href="/integrations" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--hover-surface)] transition-colors">
              <Cpu size={14} className="text-[var(--text-muted)]" /> Integrasi
            </Link>
            <Link href="/logs" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--hover-surface)] transition-colors">
              <Terminal size={14} className="text-[var(--text-muted)]" /> Logs
            </Link>
            <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--hover-surface)] transition-colors">
              <Settings size={14} className="text-[var(--text-muted)]" /> Pengaturan
            </Link>
            <div className="h-[0.5px] bg-[var(--border)]/60 my-1" />
            <button onClick={() => { signOut(); setShowProfileMenu(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors">
              <LogOut size={14} /> Keluar
            </button>
          </nav>
        </div>
      )}

      {/* Bottom Profile Card */}
      <div className="p-3 border-t-[0.5px] border-[var(--border)]">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex w-full items-center justify-between rounded-xl hover:bg-[var(--hover-surface)] p-2 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-chat text-sm font-bold text-white uppercase">
              {userDisplayName.slice(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">{userDisplayName}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">Free</span>
            </div>
          </div>
          <ChevronRight size={14} className={`text-[var(--text-muted)] transition-transform duration-200 ${showProfileMenu ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </div>
  );
}
