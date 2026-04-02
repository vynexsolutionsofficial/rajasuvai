import { supabase } from '../supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let tokenCache: { token: string | null; expiry: number } = { token: null, expiry: 0 };

const getAuthToken = async () => {
  const now = Date.now();
  // Return cached token if fresh (5 min cache)
  if (tokenCache.token && now < tokenCache.expiry) {
    return tokenCache.token;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || null;
  
  // Cache for 5 minutes
  tokenCache = { token, expiry: now + 5 * 60 * 1000 };

  if (token) return token;
  
  // Development bypass
  if (localStorage.getItem('rajasuvai_dev_admin') === 'true') {
    return 'DEV_ADMIN_TOKEN';
  }
  
  return null;
};

export const api = {
  async get(endpoint: string, params: Record<string, any> = {}) {
    const token = await getAuthToken();
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  async post(endpoint: string, body: any) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return response.json();
  },

  async put(endpoint: string, body: any) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return response.json();
  },

  async delete(endpoint: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};
