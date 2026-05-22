import { supabase } from '../supabaseClient.js';

const products = [
  { id: 200, name: 'Black Pepper', price: '120', category: 'Spices', image: 'blackpepper', description: 'Premium quality black pepper for all your culinary needs.', sku: 'SKU-BP-001', status: 'active' },
  { id: 201, name: 'Black Pepper 100gm', price: '65', category: 'Spices', image: 'blackpepper 100gm', description: 'Premium quality black pepper 100gm pack.', sku: 'SKU-BP-002', status: 'active' },
  { id: 202, name: 'Corn Flour', price: '45', category: 'Flours', image: 'cornflour', description: 'Fine milled corn flour for thickening and baking.', sku: 'SKU-CF-001', status: 'active' },
  { id: 203, name: 'Fennel Seeds', price: '90', category: 'Spices', image: 'fennel', description: 'Aromatic fennel seeds perfect for tempering and digestion.', sku: 'SKU-FN-001', status: 'active' },
  { id: 204, name: 'Fenugreek Seeds', price: '85', category: 'Spices', image: 'fenugreek', description: 'Bitter-sweet fenugreek seeds for traditional recipes.', sku: 'SKU-FG-001', status: 'active' },
  { id: 205, name: 'Gram Flour (Besan)', price: '75', category: 'Flours', image: 'gramflour', description: 'Pure gram flour ideal for sweets and savories.', sku: 'SKU-GF-001', status: 'active' },
  { id: 206, name: 'Gram Flour 200gm', price: '40', category: 'Flours', image: 'gramflour 200gm', description: 'Pure gram flour 200gm pack.', sku: 'SKU-GF-002', status: 'active' },
  { id: 207, name: 'Jeera (Cumin)', price: '140', category: 'Spices', image: 'jeera', description: 'Earthy cumin seeds, a staple for everyday cooking.', sku: 'SKU-JR-001', status: 'active' },
  { id: 208, name: 'Kadalai (Chana)', price: '95', category: 'Pulses', image: 'kadalai', description: 'High-protein chana for daily meals.', sku: 'SKU-KD-001', status: 'active' },
  { id: 209, name: 'Kadalai 100gm', price: '50', category: 'Pulses', image: 'kadalai 100gm', description: 'High-protein chana 100gm pack.', sku: 'SKU-KD-002', status: 'active' },
  { id: 210, name: 'Maida', price: '45', category: 'Flours', image: 'maida', description: 'Refined wheat flour for soft breads and pastries.', sku: 'SKU-MD-001', status: 'active' },
  { id: 211, name: 'Mustard Seeds', price: '60', category: 'Spices', image: 'mustard', description: 'Pungent mustard seeds essential for tadka.', sku: 'SKU-MS-001', status: 'active' },
  { id: 212, name: 'Rava (Semolina)', price: '55', category: 'Flours', image: 'rava', description: 'Coarse rava perfect for upma and kesari.', sku: 'SKU-RV-001', status: 'active' },
  { id: 213, name: 'Rice Flour', price: '50', category: 'Flours', image: 'riceflour', description: 'Finely ground rice flour for traditional snacks.', sku: 'SKU-RF-001', status: 'active' },
];

async function seedProducts() {
  console.log('Starting seed process...');
  
  // Fetch categories
  const { data: categoriesData, error: catError } = await supabase.from('categories').select('id, name');
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }
  
  const getCategoryId = (catName) => {
    const cat = categoriesData.find(c => c.name.toLowerCase() === catName.toLowerCase());
    return cat ? cat.id : null;
  };

  // Map category to category_id
  const formattedProducts = products.map(p => {
    const { category, ...rest } = p;
    return {
      ...rest,
      category_id: getCategoryId(category)
    };
  });
  
  // Insert products
  const { data, error } = await supabase
    .from('products')
    .upsert(formattedProducts, { onConflict: 'sku' })
    .select();
    
  if (error) {
    console.error('Error inserting products:', error);
    return;
  }
  
  console.log(`Successfully added/updated ${data.length} products!`);
  
  // Now add inventory for these new products
  for (const product of data) {
    const { error: invErr } = await supabase
      .from('inventory')
      .upsert({ product_id: product.id, quantity: 50, low_stock_threshold: 10 }, { onConflict: 'product_id' });
      
    if (invErr) {
      console.error(`Error adding inventory for ${product.name}:`, invErr);
    }
  }
  
  console.log('Inventory seeded successfully!');
}

seedProducts();
