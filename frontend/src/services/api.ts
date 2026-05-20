import { supabase } from '../supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let tokenCache: { token: string | null; expiry: number } = { token: null, expiry: 0 };

const getAuthToken = async () => {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiry) {
    return tokenCache.token;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || null;
  tokenCache = { token, expiry: now + 5 * 60 * 1000 };
  return token;
};

const throwIfError = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || `Request failed: ${response.status}`);
  return data;
};

export const api = {
  async get(endpoint: string, params: Record<string, any> = {}) {
    const token = await getAuthToken();
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return throwIfError(response);
  },

  async post(endpoint: string, body: any) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return throwIfError(response);
  },

  async put(endpoint: string, body: any) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return throwIfError(response);
  },

  async patch(endpoint: string, body: any) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return throwIfError(response);
  },

  async delete(endpoint: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return throwIfError(response);
  }
};
