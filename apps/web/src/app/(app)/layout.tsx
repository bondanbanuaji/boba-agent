'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SessionSidebar } from '@/components/chat/SessionSidebar';
import { ContextPanel } from '@/components/layout/ContextPanel';
import { ContextPanelProvider, useContextPanel } from '@/components/layout/ContextPanelProvider';
import { Menu, ChevronLeft } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { isOpen, content } = useContextPanel();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[var(--bg)]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Global Collapsible Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[240px] shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0'
        }`}
      >
        <SessionSidebar />
      </div>

      {/* Main Page Viewport */}
      <div
        className={`flex flex-1 flex-col overflow-hidden min-w-0 transition-all duration-300 ${
          isOpen && content ? 'md:pr-[280px]' : ''
        }`}
      >
        {/* Global Responsive Navigation Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b-[0.5px] border-[var(--border)] px-4 bg-[var(--surface)]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)] transition-colors"
              title={sidebarOpen ? 'Sembunyikan Menu' : 'Tampilkan Menu'}
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
            </button>
            <span className="font-chat text-sm font-bold text-[var(--text-primary)]">
              Boba<span className="text-[var(--accent)]">Agent</span>
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden min-h-0 relative">
          {children}
        </div>
      </div>

      <ContextPanel />
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthGuard>
      <ContextPanelProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </ContextPanelProvider>
    </AuthGuard>
  );
}
