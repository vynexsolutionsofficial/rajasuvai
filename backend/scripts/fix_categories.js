import { supabase } from '../supabaseClient.js';

const products = [
  // ── Fried Gram ──────────────────────────────────────────────────────────────
  { sku: 'SKU-FG-050', category: 'Pulses' },
  { sku: 'SKU-FG-100', category: 'Pulses' },
  { sku: 'SKU-FG-200', category: 'Pulses' },
  { sku: 'SKU-FG-500', category: 'Pulses' },

  // ── Cumin ───────────────────────────────────────────────────────────────────
  { sku: 'SKU-CM-050', category: 'Spices' },
  { sku: 'SKU-CM-100', category: 'Spices' },

  // ── Sago ────────────────────────────────────────────────────────────────────
  { sku: 'SKU-SG-050', category: 'Pulses' },
  { sku: 'SKU-SG-100', category: 'Pulses' },

  // ── Black Pepper ─────────────────────────────────────────────────────────────
  { sku: 'SKU-PP-050', category: 'Spices' },
  { sku: 'SKU-PP-100', category: 'Spices' },

  // ── Fennel ───────────────────────────────────────────────────────────────────
  { sku: 'SKU-FN-050', category: 'Spices' },
  { sku: 'SKU-FN-100', category: 'Spices' },

  // ── Maida ────────────────────────────────────────────────────────────────────
  { sku: 'SKU-MD-250', category: 'Flours' },
  { sku: 'SKU-MD-500', category: 'Flours' },

  // ── Rava ─────────────────────────────────────────────────────────────────────
  { sku: 'SKU-RV-250', category: 'Flours' },
  { sku: 'SKU-RV-500', category: 'Flours' },

  // ── Gram Flour ───────────────────────────────────────────────────────────────
  { sku: 'SKU-GF-200', category: 'Flours' },
  { sku: 'SKU-GF-500', category: 'Flours' },

  // ── Rice Flour ────────────────────────────────────────────────────────────────
  { sku: 'SKU-RF-500', category: 'Flours' },

  // ── Corn Flour ────────────────────────────────────────────────────────────────
  { sku: 'SKU-CF-100', category: 'Flours' },
  { sku: 'SKU-CF-500', category: 'Flours' },

  // ── Keep unchanged (not in price chart) ──────────────────────────────────────
  { sku: 'SKU-FNG-001', category: 'Spices' },
  { sku: 'SKU-MS-001',  category: 'Spices' },
];

async function fixCategories() {
  console.log('1. Updating existing categories...');
  // Update 1, 2, 3 to Spices, Pulses, Flours
  await supabase.from('categories').update({ name: 'Spices' }).eq('id', 1);
  await supabase.from('categories').update({ name: 'Pulses' }).eq('id', 2);
  await supabase.from('categories').update({ name: 'Flours' }).eq('id', 3);
  
  console.log('2. Deleting unused category id 4...');
  await supabase.from('categories').delete().eq('id', 4);

  // Refetch to be safe
  const { data: finalCats } = await supabase.from('categories').select('*');
  console.log('Final categories:', finalCats);

  console.log('5. Updating products with correct category_id and category text...');
  for (const p of products) {
    const cat = finalCats.find(c => c.name.toLowerCase() === p.category.toLowerCase());
    if (cat) {
      const { error: updErr } = await supabase
        .from('products')
        .update({ category_id: cat.id }) // Only update category_id
        .eq('sku', p.sku);
      
      if (updErr) console.error(`Failed to update ${p.sku}:`, updErr.message);
    }
  }

  console.log('✅ Finished fixing categories and products!');
}

fixCategories();
