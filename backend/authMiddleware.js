import { supabase } from './supabaseClient.js';

// Auto-ensure a client record exists for authenticated users
const ensureClientRecord = async (email, name = null) => {
  try {
    const displayName = name || email.split('@')[0];
    // Use upsert with onConflict so it safely skips if email already exists
    const { error: upsertError } = await supabase
      .from('clients')
      .upsert(
        [{
          name: displayName,
          email: email.toLowerCase(),
          password_hash: 'managed_by_supabase_auth',
          phone: '',
          address: '',
          role: 'customer'
        }],
        { onConflict: 'email', ignoreDuplicates: true }
      );

    if (upsertError) {
      console.error('[Auth] Failed to ensure client record:', upsertError.message);
    }
  } catch (err) {
    console.error('[Auth] ensureClientRecord error:', err.message);
  }
};

export const authenticateToken = async (req, res, next) => {
  // BYPASS AUTHENTICATION FOR LOCAL TESTING
  req.user = { email: 'admin@rajasuvai.com' };
  next();
};

export const requireAdmin = async (req, res, next) => {
  // BYPASS ADMIN CHECK FOR LOCAL TESTING
  next();
};
