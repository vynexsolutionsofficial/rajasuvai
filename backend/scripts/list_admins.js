import { supabase } from '../supabaseClient.js';

async function listAdmins() {
  const { data, error } = await supabase
    .from('clients')
    .select('email, role')
    .eq('role', 'admin');
  
  if (error) {
    console.error('Error fetching admins:', error);
  } else {
    console.log('Admins found:', data);
  }
}
listAdmins();
