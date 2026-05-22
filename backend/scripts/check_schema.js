import { supabase } from '../supabaseClient.js';

async function checkSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) console.error(error);
  else console.log('Products columns:', data.length > 0 ? Object.keys(data[0]) : 'Empty table, but success');
}
checkSchema();
