import { supabase } from '../supabaseClient.js';

const { data } = await supabase.from('products').select('id, name, sku').order('id');
data.forEach(p => console.log(`#${p.id} | ${p.name} | ${p.sku}`));
