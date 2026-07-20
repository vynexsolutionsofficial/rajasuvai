// Run this via node to create the primary admin user
import { supabase } from '../supabaseClient.js';

const ADMIN_EMAIL = 'admin@rajasuvai.com';
const ADMIN_PASSWORD = 'AdminPassword123!';

async function createAdmin() {
  console.log('--- Creating Official Admin User ---');

  // 1. Create in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('Admin already exists in Auth.');
    } else {
      console.error('Auth Error:', error.message);
      return;
    }
  } else {
    console.log('✅ Admin created in Supabase Auth');
  }

  // 2. Set role to 'admin' in clients table
  const { error: roleErr } = await supabase
    .from('clients')
    .upsert({ 
      email: ADMIN_EMAIL, 
      role: 'admin',
      password_hash: 'managed_by_supabase_auth'
    }, { onConflict: 'email' });

  if (roleErr) {
    console.error('Role Update Error:', roleErr.message);
  } else {
    console.log('✅ Admin role assigned in clients table');
    console.log(`\nCREDENTIALS:\nEmail: ${ADMIN_EMAIL}\nPassword: ${ADMIN_PASSWORD}`);
  }
}

createAdmin();
