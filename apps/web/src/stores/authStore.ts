import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

async function syncUserWithBackend(user: User, session: Session) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/auth/sync`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      }),
    });
    if (!response.ok) {
      console.error('Failed to sync user with backend:', await response.text());
    }
  } catch (error) {
    console.error('Error syncing user with backend:', error);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user || null, isLoading: false, isInitialized: true });

      if (session?.user && session) {
        await syncUserWithBackend(session.user, session);
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user || null });
        if (session?.user && session) {
          await syncUserWithBackend(session.user, session);
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, isLoading: false });
  },
}));
