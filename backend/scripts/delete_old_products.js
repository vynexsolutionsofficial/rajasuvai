import { supabase } from '../supabaseClient.js';

// Old placeholder product IDs to remove (200-213 except 211 = Mustard Seeds, kept & updated)
const OLD_IDS = [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 212, 213];

async function deleteOld() {
  console.log(`Deleting ${OLD_IDS.length} old placeholder products…`);

  // Remove FK rows first
  const { error: invErr } = await supabase.from('inventory').delete().in('product_id', OLD_IDS);
  if (invErr) console.warn('Inventory delete warning:', invErr.message);

  const { error: oiErr } = await supabase.from('order_items').delete().in('product_id', OLD_IDS);
  if (oiErr) console.warn('Order items delete warning:', oiErr.message);

  const { error: delErr } = await supabase.from('products').delete().in('id', OLD_IDS);
  if (delErr) { console.error('Delete error:', delErr.message); process.exit(1); }

  console.log('✅ Old products removed.');
}

deleteOld();
