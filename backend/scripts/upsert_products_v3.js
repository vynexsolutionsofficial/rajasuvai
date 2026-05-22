import { supabase } from '../supabaseClient.js';

// Full product catalogue from official price chart (May 2026)
// price = retail price shown to customers
// bulk_rate / wholesale_price stored for admin reference
const products = [
  // ── Fried Gram ──────────────────────────────────────────────────────────────
  { sku: 'SKU-FG-050', name: 'Fried Gram 50gm',  price: '160', bulk_rate: 96,  wholesale_price: 102, category: 'Pulses', image: 'kadalai',       description: 'Crispy roasted gram, perfect for snacking — 50gm pack.',  status: 'active' },
  { sku: 'SKU-FG-100', name: 'Fried Gram 100gm', price: '160', bulk_rate: 96,  wholesale_price: 102, category: 'Pulses', image: 'kadalai 100gm', description: 'Crispy roasted gram, perfect for snacking — 100gm pack.', status: 'active' },
  { sku: 'SKU-FG-200', name: 'Fried Gram 200gm', price: '160', bulk_rate: 96,  wholesale_price: 102, category: 'Pulses', image: 'kadalai',       description: 'Crispy roasted gram, perfect for snacking — 200gm pack.', status: 'active' },
  { sku: 'SKU-FG-500', name: 'Fried Gram 500gm', price: '160', bulk_rate: 96,  wholesale_price: 102, category: 'Pulses', image: 'kadalai',       description: 'Crispy roasted gram, perfect for snacking — 500gm pack.', status: 'active' },

  // ── Cumin ───────────────────────────────────────────────────────────────────
  { sku: 'SKU-CM-050', name: 'Cumin 50gm',  price: '350', bulk_rate: 280, wholesale_price: 295, category: 'Spices', image: 'jeera', description: 'Earthy cumin seeds — a staple for everyday cooking, 50gm.',  status: 'active' },
  { sku: 'SKU-CM-100', name: 'Cumin 100gm', price: '350', bulk_rate: 280, wholesale_price: 295, category: 'Spices', image: 'jeera', description: 'Earthy cumin seeds — a staple for everyday cooking, 100gm.', status: 'active' },

  // ── Sago ────────────────────────────────────────────────────────────────────
  { sku: 'SKU-SG-050', name: 'Sago 50gm',  price: '120', bulk_rate: 80, wholesale_price: 85, category: 'Pulses', image: 'sago', description: 'Fine sago pearls, ideal for kheer and upma — 50gm pack.',  status: 'active' },
  { sku: 'SKU-SG-100', name: 'Sago 100gm', price: '120', bulk_rate: 80, wholesale_price: 85, category: 'Pulses', image: 'sago', description: 'Fine sago pearls, ideal for kheer and upma — 100gm pack.', status: 'active' },

  // ── Black Pepper ─────────────────────────────────────────────────────────────
  { sku: 'SKU-PP-050', name: 'Black Pepper 50gm',  price: '950', bulk_rate: 785, wholesale_price: 800, category: 'Spices', image: 'blackpepper',        description: 'Premium bold black pepper for all culinary needs — 50gm.',  status: 'active' },
  { sku: 'SKU-PP-100', name: 'Black Pepper 100gm', price: '950', bulk_rate: 785, wholesale_price: 800, category: 'Spices', image: 'blackpepper 100gm', description: 'Premium bold black pepper for all culinary needs — 100gm.', status: 'active' },

  // ── Fennel ───────────────────────────────────────────────────────────────────
  { sku: 'SKU-FN-050', name: 'Fennel 50gm',  price: '250', bulk_rate: 185, wholesale_price: 195, category: 'Spices', image: 'fennel', description: 'Aromatic fennel seeds perfect for tempering and digestion — 50gm.',  status: 'active' },
  { sku: 'SKU-FN-100', name: 'Fennel 100gm', price: '250', bulk_rate: 185, wholesale_price: 195, category: 'Spices', image: 'fennel', description: 'Aromatic fennel seeds perfect for tempering and digestion — 100gm.', status: 'active' },

  // ── Maida ────────────────────────────────────────────────────────────────────
  { sku: 'SKU-MD-250', name: 'Maida 250gm', price: '75', bulk_rate: 58, wholesale_price: 65, category: 'Flours', image: 'maida', description: 'Refined wheat flour for soft breads and pastries — 250gm.', status: 'active' },
  { sku: 'SKU-MD-500', name: 'Maida 500gm', price: '75', bulk_rate: 58, wholesale_price: 65, category: 'Flours', image: 'maida', description: 'Refined wheat flour for soft breads and pastries — 500gm.', status: 'active' },

  // ── Rava ─────────────────────────────────────────────────────────────────────
  { sku: 'SKU-RV-250', name: 'Rava 250gm', price: '75', bulk_rate: 58, wholesale_price: 65, category: 'Flours', image: 'rava', description: 'Coarse rava (semolina) perfect for upma and kesari — 250gm.', status: 'active' },
  { sku: 'SKU-RV-500', name: 'Rava 500gm', price: '75', bulk_rate: 58, wholesale_price: 65, category: 'Flours', image: 'rava', description: 'Coarse rava (semolina) perfect for upma and kesari — 500gm.', status: 'active' },

  // ── Gram Flour ───────────────────────────────────────────────────────────────
  { sku: 'SKU-GF-200', name: 'Gram Flour 200gm', price: '100', bulk_rate: 78, wholesale_price: 85, category: 'Flours', image: 'gramflour 200gm', description: 'Pure gram flour (besan) ideal for sweets and savories — 200gm.', status: 'active' },
  { sku: 'SKU-GF-500', name: 'Gram Flour 500gm', price: '100', bulk_rate: 75, wholesale_price: 85, category: 'Flours', image: 'gramflour',       description: 'Pure gram flour (besan) ideal for sweets and savories — 500gm.', status: 'active' },

  // ── Rice Flour ────────────────────────────────────────────────────────────────
  { sku: 'SKU-RF-500', name: 'Rice Flour 500gm', price: '70', bulk_rate: 46, wholesale_price: 59, category: 'Flours', image: 'riceflour', description: 'Finely ground rice flour for traditional snacks and sweets — 500gm.', status: 'active' },

  // ── Corn Flour ────────────────────────────────────────────────────────────────
  { sku: 'SKU-CF-100', name: 'Corn Flour 100gm', price: '80', bulk_rate: 58, wholesale_price: 65, category: 'Flours', image: 'cornflour', description: 'Fine corn flour for thickening and baking — 100gm.', status: 'active' },
  { sku: 'SKU-CF-500', name: 'Corn Flour 500gm', price: '70', bulk_rate: 48, wholesale_price: 50, category: 'Flours', image: 'cornflour', description: 'Fine corn flour for thickening and baking — 500gm.', status: 'active' },

  // ── Keep unchanged (not in price chart) ──────────────────────────────────────
  { sku: 'SKU-FNG-001', name: 'Fenugreek Seeds', price: '85', bulk_rate: null, wholesale_price: null, category: 'Spices', image: 'fenugreek', description: 'Bitter-sweet fenugreek seeds for traditional recipes.', status: 'active' },
  { sku: 'SKU-MS-001',  name: 'Mustard Seeds',   price: '60', bulk_rate: null, wholesale_price: null, category: 'Spices', image: 'mustard',   description: 'Pungent mustard seeds essential for tadka.',        status: 'active' },
];

async function upsertProducts() {
  console.log('Fetching categories…');
  const { data: cats, error: catErr } = await supabase.from('categories').select('id, name');
  if (catErr) { console.error('Category fetch error:', catErr.message); process.exit(1); }

  const getCategoryId = (name) => {
    const cat = cats.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat ? cat.id : null;
  };

  const formatted = products.map(({ category, ...rest }) => ({
    ...rest,
    category_id: getCategoryId(category),
  }));

  console.log(`Upserting ${formatted.length} products…`);
  const { data, error } = await supabase
    .from('products')
    .upsert(formatted, { onConflict: 'sku' })
    .select();

  if (error) { console.error('Upsert error:', error.message); process.exit(1); }
  console.log(`✅ Upserted ${data.length} products successfully.`);

  // Ensure inventory row exists for each product
  for (const product of data) {
    const { error: invErr } = await supabase
      .from('inventory')
      .upsert({ product_id: product.id, quantity: 50, low_stock_threshold: 10 }, { onConflict: 'product_id' });
    if (invErr) console.warn(`  Inventory warning for ${product.name}:`, invErr.message);
  }
  console.log('✅ Inventory rows ensured.');
}

upsertProducts();
