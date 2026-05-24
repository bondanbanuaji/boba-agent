'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.push('/login');
    }
  }, [isInitialized, isLoading, user, router]);

  if (!isInitialized || isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-24 w-full rounded" />
          <div className="skeleton h-12 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
