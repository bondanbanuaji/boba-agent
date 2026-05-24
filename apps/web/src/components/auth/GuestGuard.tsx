'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { user, isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && !isLoading && user) {
      // If user is already logged in, redirect away from guest pages (login/register/landing)
      router.push('/chat');
    }
  }, [isInitialized, isLoading, user, router]);

  // While checking auth status, we can show the children or a loader
  // For GuestGuard, showing the children is usually fine as the redirect will happen quickly
  // But if we want to prevent flicker, we might want to hide them if logged in
  if (isInitialized && !isLoading && user) {
    return null; // Redirecting...
  }

  return <>{children}</>;
}
