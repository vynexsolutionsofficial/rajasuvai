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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // --- DEVELOPMENT BYPASS ---
  if (token === 'DEV_ADMIN_TOKEN') {
    const devEmail = 'admin@rajasuvai.com';
    req.user = { email: devEmail, role: 'admin' };
    // Ensure the dev admin has a client record
    await ensureClientRecord(devEmail, 'Dev Admin');
    return next();
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    // Auto-create client record for any new Supabase Auth user
    await ensureClientRecord(user.email, user.user_metadata?.full_name || user.user_metadata?.name);
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // --- DEVELOPMENT BYPASS ---
  if (req.user.email === 'admin@rajasuvai.com' && req.user.role === 'admin') {
    return next();
  }

  try {
    const { data: client, error } = await supabase
      .from('clients')
      .select('role')
      .ilike('email', req.user.email)
      .maybeSingle();

    if (error || !client || client.role.toLowerCase() !== 'admin') {
      console.warn(`Admin access denied for: ${req.user.email}`);
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ error: 'Authorization error' });
  }
};
