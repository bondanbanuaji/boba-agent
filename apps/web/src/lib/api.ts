import { supabase } from './supabase';

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = new Headers(options.headers);
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${getBaseUrl()}${endpoint}`, { ...options, headers });
  
  if (res.status === 401) {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API Error');
  }
  
  return res.json();
}

export const api = {
  get: (endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, body: any, options?: Omit<RequestInit, 'method' | 'body'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  put: (endpoint: string, body: any, options?: Omit<RequestInit, 'method' | 'body'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
  delete: (endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};

// Typed specific API calls
export async function fetchAgentStatus() {
  try {
    return await api.get('/api/agent/status');
  } catch {
    return { status: 'offline' };
  }
}

export async function fetchIntegrationStatus() {
  try {
    return await api.get('/api/integrations/status');
  } catch {
    return { google: false, telegram: false, whatsapp: false };
  }
}
