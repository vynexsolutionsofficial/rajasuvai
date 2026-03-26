import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rajasuvai Backend is running' });
});

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, phone, address } = req.body;

  try {
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Create record in our 'clients' table
    const { error: clientError } = await supabase
      .from('clients')
      .insert([
        { 
          email, 
          password_hash: 'managed_by_supabase_auth', // We don't store plain passwords
          phone, 
          address, 
          role: 'customer' // Default role
        }
      ]);

    if (clientError) throw clientError;

    res.status(201).json({ message: 'User registered successfully', user: authData.user });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({ 
      message: 'Login successful', 
      token: data.session.access_token,
      user: data.user 
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

// --- PROTECTED ADMIN ROUTES ---

import { authenticateToken, requireAdmin } from './authMiddleware.js';

app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Basic stats example: count products and total sales
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { data: salesData } = await supabase.from('sales').select('total_amount');
    
    const totalSales = salesData?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0;

    res.json({
      totalProducts: productCount,
      totalSales: totalSales,
      status: 'Protected data retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ORDER & CHECKOUT ROUTES ---

app.post('/api/orders', async (req, res) => {
  const { client_email, items } = req.body; // items: [{ product_id, quantity }]

  if (!client_email || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing client email or items' });
  }

  try {
    // 1. Get Client ID
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id')
      .eq('email', client_email)
      .single();

    if (clientErr || !client) throw new Error('Client not found. Please register first.');

    let totalPrice = 0;
    const updates = [];

    // 2. Validate Stock and Calculate Total
    for (const item of items) {
      // Get Product Price
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .select('name, price')
        .eq('id', item.product_id)
        .single();
      
      if (prodErr || !product) throw new Error(`Product ${item.product_id} not found`);

      // Get Inventory
      const { data: inv, error: invErr } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', item.product_id)
        .single();

      if (invErr || !inv) throw new Error(`Inventory not found for ${product.name}`);
      if (inv.quantity < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      // Clean price string (e.g., "₹450" -> 450)
      const numericPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
      totalPrice += numericPrice * item.quantity;
      
      updates.push({ product_id: item.product_id, newQuantity: inv.quantity - item.quantity });
    }

    // 3. Create Order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([{ 
        client_id: client.id, 
        status: 'ordered', 
        total_price: totalPrice 
      }])
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 4. Create Sales Record
    const { error: salesErr } = await supabase
      .from('sales')
      .insert([{
        order_id: order.id,
        total_amount: totalPrice
      }]);

    if (salesErr) throw salesErr;

    // 5. Update Inventory (Sequential for now)
    for (const update of updates) {
      await supabase
        .from('inventory')
        .update({ quantity: update.newQuantity })
        .eq('product_id', update.product_id);
    }

    res.status(201).json({ 
      message: 'Order placed successfully!', 
      orderId: order.id, 
      total: totalPrice 
    });

  } catch (error) {
    console.error('Checkout Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
