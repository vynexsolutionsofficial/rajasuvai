import { supabase } from '../supabaseClient.js';

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@rajasuvai.com',
    password: 'rmvjeyghfyyrsxyr',
  });
  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('Login success:', data);
  }
}
testLogin();
