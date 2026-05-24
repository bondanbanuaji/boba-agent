import type { ReactNode } from 'react';
import Link from 'next/link';
import { GuestGuard } from '@/components/auth/GuestGuard';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-12">
        <div className="w-full max-w-[440px] rounded-2xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-8 md:p-10">
          <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5 text-decoration-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] font-chat text-base font-bold text-white">
                B
              </div>
              <span className="font-chat text-lg font-bold text-[var(--text-primary)]">
                Boba<span className="text-[var(--accent)]">Agent</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
