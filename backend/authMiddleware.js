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
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const email = data.user.email.toLowerCase();

  await ensureClientRecord(email, data.user.user_metadata?.full_name || data.user.user_metadata?.name);

  const { data: client } = await supabase
    .from('clients')
    .select('id, role')
    .ilike('email', email)
    .maybeSingle();

  req.user = {
    id: client?.id ?? null,
    email: data.user.email,
    role: client?.role || 'customer'
  };
  next();
};

// Attaches req.user when a valid token is present, but never blocks the
// request — for endpoints that behave differently for guests vs. logged-in
// users without requiring login (e.g. a public contact form).
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    req.user = null;
    return next();
  }

  const email = data.user.email.toLowerCase();
  await ensureClientRecord(email, data.user.user_metadata?.full_name || data.user.user_metadata?.name);

  const { data: client } = await supabase
    .from('clients')
    .select('id, role')
    .ilike('email', email)
    .maybeSingle();

  req.user = {
    id: client?.id ?? null,
    email: data.user.email,
    role: client?.role || 'customer'
  };
  next();
};

export const requireAdmin = async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
