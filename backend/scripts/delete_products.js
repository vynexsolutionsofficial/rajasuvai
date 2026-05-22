import { supabase } from '../supabaseClient.js';

const NAMES_TO_DELETE = [
  'Red Chilli',
  'Garam Masala',
  'Biryani Masala',
  'Moong Dhal',
  'Turmeric'
];

async function deleteProducts() {
  console.log('Looking up products to delete...');

  // Find matching products (case-insensitive)
  const { data: found, error: fetchErr } = await supabase
    .from('products')
    .select('id, name, sku')
    .or(NAMES_TO_DELETE.map(n => `name.ilike.%${n}%`).join(','));

  if (fetchErr) { console.error('Fetch error:', fetchErr.message); process.exit(1); }
  if (!found || found.length === 0) { console.log('No matching products found.'); process.exit(0); }

  console.log(`Found ${found.length} product(s) to delete:`);
  found.forEach(p => console.log(`  #${p.id} — ${p.name} (${p.sku})`));

  const ids = found.map(p => p.id);

  // Delete inventory rows first (FK constraint)
  const { error: invErr } = await supabase.from('inventory').delete().in('product_id', ids);
  if (invErr) console.warn('Inventory delete warning:', invErr.message);

  // Delete order_items rows (FK constraint)
  const { error: oiErr } = await supabase.from('order_items').delete().in('product_id', ids);
  if (oiErr) console.warn('Order items delete warning:', oiErr.message);

  // Delete the products
  const { error: delErr } = await supabase.from('products').delete().in('id', ids);
  if (delErr) { console.error('Delete error:', delErr.message); process.exit(1); }

  console.log(`\n✅ Successfully deleted ${found.length} product(s).`);
}

deleteProducts();
