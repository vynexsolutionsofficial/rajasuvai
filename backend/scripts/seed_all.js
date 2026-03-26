import { supabase } from '../supabaseClient.js';

async function seedAll() {
  console.log('--- Starting Comprehensive Seeding ---');

  // 1. Seed Clients
  const { data: clients, error: clientErr } = await supabase
    .from('clients')
    .insert([
      { email: 'admin@rajasuvai.com', password_hash: 'hash123', role: 'admin' },
      { email: 'customer@gmail.com', password_hash: 'pass456', role: 'customer' }
    ])
    .select();
  
  if (clientErr) console.error('Clients Error:', clientErr.message);
  else console.log('✅ Clients seeded');

  // 2. Fetch Products
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name');
  
  if (prodErr) console.error('Fetch Products Error:', prodErr.message);
  else console.log(`✅ Found ${products.length} products to link`);

  if (products.length > 0) {
    // 3. Seed Inventory
    const inventoryData = products.map(p => ({
      product_id: p.id,
      quantity: Math.floor(Math.random() * 50) + 10,
      low_stock_threshold: 10
    }));

    const { error: invErr } = await supabase
      .from('inventory')
      .insert(inventoryData);
    
    if (invErr) console.error('Inventory Error:', invErr.message);
    else console.log('✅ Inventory seeded');

    // 4. Seed Orders
    if (clients && clients.length > 0) {
      const { data: orders, error: orderErr } = await supabase
        .from('orders')
        .insert([
          { client_id: clients[1].id, status: 'ordered', total_price: 1250.00 },
          { client_id: clients[1].id, status: 'shipped', total_price: 850.00 }
        ])
        .select();
      
      if (orderErr) console.error('Orders Error:', orderErr.message);
      else {
        console.log('✅ Orders seeded');

        // 5. Seed Sales
        const { error: salesErr } = await supabase
          .from('sales')
          .insert(orders.map(o => ({
            order_id: o.id,
            total_amount: o.total_price
          })));
        
        if (salesErr) console.error('Sales Error:', salesErr.message);
        else console.log('✅ Sales seeded');
      }
    }
  }

  console.log('--- Seeding Completed ---');
}

seedAll();
