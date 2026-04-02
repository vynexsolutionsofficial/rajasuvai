import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient.js';
import {
  sendLoginEmail,
  sendOrderEmail,
  sendOrderStatusEmail
} from './emailService.js';
import { sendWhatsAppOTP } from './whatsappService.js';
// --- ROUTE IMPORTS ---
import addressRoutes from './routes/addressRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 3000; // Forced to 3000 for consistency with frontend

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rajasuvai Backend is running' });
});

// --- API ROUTES ---
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);

// --- AUTHENTICATION ROUTES ---

const otpStore = new Map(); // Mock OTP store: phone -> otp

app.post('/api/auth/send-otp', async (req, res) => {
  const { phone, mode } = req.body; // mode: 'login' or 'signup'

  try {
    // 1. Database Check based on Mode
    const { data: user, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .eq('phone', phone)
      .single();

    if (mode === 'login') {
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this number' });
      }
    } else if (mode === 'signup') {
      if (user) {
        return res.status(400).json({ success: false, message: 'This number is already registered' });
      }
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);
    console.log(`[MOCK OTP] Generated for ${phone} (${mode}): ${otp}`);

    // 3. Send via WhatsApp
    const waResult = await sendWhatsAppOTP(phone, otp);

    res.json({
      success: true,
      message: waResult.success ? 'OTP sent via WhatsApp' : 'OTP generated (Check terminal for mock)'
    });
  } catch (error) {
    console.error('OTP Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = otpStore.get(phone);

  if (storedOtp && storedOtp === otp) {
    otpStore.delete(phone);
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
});

app.get('/api/auth/check-phone/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name')
      .eq('phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ exists: !!data, user: data || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // 1. Pre-check if phone or email exists
    const { data: existingUser } = await supabase
      .from('clients')
      .select('id, email, phone')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.phone === phone ? 'Mobile number already registered' : 'Email already registered'
      });
    }

    // 2. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 3. Create record in 'clients' table
    const { error: clientError } = await supabase
      .from('clients')
      .insert([
        {
          name,
          email,
          password_hash: 'managed_by_supabase_auth',
          phone,
          address,
          role: 'customer'
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

// --- PRODUCT ROUTES (PUBLIC) ---

app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, inventory(quantity)');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// --- PROTECTED ADMIN ROUTES ---

import { authenticateToken, requireAdmin } from './authMiddleware.js';

// 1. Dashboard Stats
app.get('/api/admin/dashboard-stats', authenticateToken, requireAdmin, async (req, res) => {
  // ... existing implementation
});

// 2. Categories
app.get('/api/admin/categories', authenticateToken, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Admin Products CRUD
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name), inventory(quantity, low_stock_threshold)')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  const { name, price, category_id, image, description, sku, initial_stock, low_stock_threshold } = req.body;

  try {
    // Insert Product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert([{ name, price, category_id, image, description, sku, status: 'active' }])
      .select()
      .single();

    if (prodErr) throw prodErr;

    // Create Inventory Record
    const { error: invErr } = await supabase
      .from('inventory')
      .insert([{ 
        product_id: product.id, 
        quantity: initial_stock || 0, 
        low_stock_threshold: low_stock_threshold || 10 
      }]);

    if (invErr) throw invErr;

    res.json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, category_id, image, description, sku, quantity, low_stock_threshold, status } = req.body;

  try {
    // Update Product
    const { error: prodErr } = await supabase
      .from('products')
      .update({ name, price, category_id, image, description, sku, status })
      .eq('id', id);

    if (prodErr) throw prodErr;

    // Update Inventory
    const { error: invErr } = await supabase
      .from('inventory')
      .update({ quantity, low_stock_threshold })
      .eq('product_id', id);

    if (invErr) throw invErr;

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Product deleted successfully' });
});

// 4. Stock Adjustment
app.patch('/api/admin/products/:id/stock', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const { error } = await supabase
    .from('inventory')
    .update({ quantity })
    .eq('product_id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Stock updated successfully' });
});

app.get('/api/admin/dashboard-stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 1. Total Orders Count
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    // 2. Total Revenue (Sum of sales)
    const { data: salesData } = await supabase.from('sales').select('total_amount');
    const totalRevenue = salesData?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0;

    // 3. Total Users (Customers)
    const { count: userCount } = await supabase
      .from('clients')
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    // 4. Recent Orders (Last 10)
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*, clients(name, email)')
      .order('created_at', { ascending: false })
      .limit(10);

    // 5. Low Stock Alerts
    const { data: lowStock } = await supabase
      .from('inventory')
      .select('*, products(name)')
      .lte('quantity', 10); // Using 10 as default threshold for now

    res.json({
      totalOrders: orderCount || 0,
      totalRevenue,
      totalUsers: userCount || 0,
      recentOrders: recentOrders || [],
      lowStock: lowStock || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ORDER & CHECKOUT ROUTES ---
// (Migrated to /api/payments for enhanced security and atomicity)


// --- ADMIN ORDER STATUS UPDATE ---

app.post('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Fetch current order info with items for inventory logic
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('status, id, client_id, order_items(product_id, quantity)')
      .eq('id', id)
      .single();

    if (orderErr) throw orderErr;

    // 2. If status is being changed TO 'Cancelled', restore inventory
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      const items = order.order_items || [];
      for (const item of items) {
        const { data: inv } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('product_id', item.product_id)
          .single();

        if (inv) {
          await supabase
            .from('inventory')
            .update({ quantity: inv.quantity + item.quantity })
            .eq('product_id', item.product_id);
        }
      }
    }

    // 3. Update Order Status
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (updateErr) throw updateErr;

    // 4. Fetch Client Info for email
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('name, email')
      .eq('id', order.client_id)
      .single();

    if (!clientErr && client && client.email) {
      await sendOrderStatusEmail(client.email, client.name, order.id, status);
    }

    res.json({ success: true, message: `Order status updated to ${status}`, orderId: id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        clients (name, email, phone, address),
        order_items (*, products (name, image))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN ORDER MANAGEMENT ---

app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        clients (name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN PRODUCT CRUD ---

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN INVENTORY MANAGEMENT ---

app.get('/api/admin/inventory', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products (name)
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/inventory/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { quantity, low_stock_threshold } = req.body;
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update({ quantity, low_stock_threshold, updated_at: new Error().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. User Management
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Fetch all clients (excluding admins if desired, but here we fetch all)
    const { data: users, error: userErr } = await supabase
      .from('clients')
      .select('id, name, email, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (userErr) throw userErr;

    // Fetch order counts for each user
    const { data: orderCounts, error: countErr } = await supabase
      .from('orders')
      .select('client_id');

    if (countErr) throw countErr;

    // Map order counts to users
    const userList = users.map(user => ({
      ...user,
      order_count: orderCounts.filter(o => o.client_id === user.id).length
    }));

    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Coupon Management
app.get('/api/admin/coupons', authenticateToken, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/admin/coupons', authenticateToken, requireAdmin, async (req, res) => {
  const { code, discount_type, value, expiry_date, usage_limit } = req.body;
  const { data, error } = await supabase
    .from('coupons')
    .insert([{ code, discount_type, value, expiry_date, usage_limit, used_count: 0, status: 'active' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/admin/coupons/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Coupon deleted successfully' });
});

// 8. Payment History
app.get('/api/admin/payments', authenticateToken, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*, orders(id, client_id, clients(name, email))')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 8. User Dashboard & Order History
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    let { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .ilike('email', req.user.email)
      .maybeSingle();

    // If no client row found (race condition / first-ever request), create it now
    if (!client) {
      const displayName = req.user.user_metadata?.full_name || req.user.user_metadata?.name || req.user.email?.split('@')[0] || 'User';
      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .upsert(
          [{
            name: displayName,
            email: req.user.email.toLowerCase(),
            password_hash: 'managed_by_supabase_auth',
            phone: '',
            address: '',
            role: 'customer'
          }],
          { onConflict: 'email', ignoreDuplicates: false }
        )
        .select()
        .single();

      if (createError) {
        console.error('[Profile] Failed to create client:', createError.message);
        return res.status(500).json({ error: 'Failed to initialize user profile' });
      }
      client = newClient;
    }

    if (error && !client) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, photo_url } = req.body;
    const { data, error } = await supabase
      .from('clients')
      .update({ name, phone, address, photo_url })
      .eq('email', req.user.email)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/my-orders', authenticateToken, async (req, res) => {
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', req.user.email)
      .maybeSingle();

    // New user with no client record yet — return empty orders
    if (!client) return res.json([]);

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*, products(name, image))
      `)
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADDRESS MANAGEMENT ROUTES ---

app.get('/api/users/addresses', authenticateToken, async (req, res) => {
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', req.user.email)
      .maybeSingle();

    // New user — return empty addresses
    if (!client) return res.json([]);

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('client_id', client.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/addresses', authenticateToken, async (req, res) => {
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', req.user.email)
      .maybeSingle();

    if (!client) return res.status(404).json({ error: 'Client not found' });

    const addressData = { ...req.body, client_id: client.id };

    // If setting as default, unset others first
    if (addressData.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('client_id', client.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert([addressData])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/users/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', req.user.email)
      .maybeSingle();

    if (!client) return res.status(404).json({ error: 'Client not found' });

    // If setting as default, unset others first
    if (updates.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('client_id', client.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .eq('client_id', client.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', req.user.email)
      .maybeSingle();

    if (!client) return res.status(404).json({ error: 'Client not found' });

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('client_id', client.id);

    if (error) throw error;
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Analytics & Business Intelligence
app.get('/api/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Top 5 Selling Products
    const { data: topProducts, error: topErr } = await supabase
      .from('order_items')
      .select('product_id, quantity, products(name)')
      .limit(100);

    if (topErr) throw topErr;

    const productStats = topProducts.reduce((acc, item) => {
      const name = item.products?.name || 'Unknown';
      acc[name] = (acc[name] || 0) + item.quantity;
      return acc;
    }, {});

    const sortedProducts = Object.entries(productStats)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // Monthly Revenue Growth (Last 6 Months)
    const { data: orders, error: orderErr } = await supabase
      .from('orders')
      .select('total_price, created_at')
      .neq('status', 'Cancelled');

    if (orderErr) throw orderErr;

    const monthlyRevenue = orders.reduce((acc, order) => {
      const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + (parseFloat(order.total_price) || 0);
      return acc;
    }, {});

    res.json({
      topProducts: sortedProducts,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- EMAIL NOTIFICATION ENDPOINTS ---

app.post('/api/notifications/login', async (req, res) => {
  const { email, name } = req.body;
  const result = await sendLoginEmail(email, name);
  res.status(result.success ? 200 : 500).json(result);
});

app.post('/api/notifications/order', async (req, res) => {
  const { email, name, orderId, amount } = req.body;
  const result = await sendOrderEmail(email, name, orderId, amount);
  res.status(result.success ? 200 : 500).json(result);
});

app.post('/api/notifications/order-status', async (req, res) => {
  const { email, name, orderId, status } = req.body;
  const result = await sendOrderStatusEmail(email, name, orderId, status);
  res.status(result.success ? 200 : 500).json(result);
});

app.get('/api/admin/debug-db', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tables = ['clients', 'categories', 'products', 'inventory', 'addresses', 'orders', 'order_items', 'coupons', 'payments'];
    const status = {};

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      status[table] = error ? `Error: ${error.message}` : count;
    }

    res.json({
      message: "Database Diagnostic Report",
      timestamp: new Date().toISOString(),
      row_counts: status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- RAZORPAY PAYMENT ROUTES ---

app.post('/api/payments/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt = 'receipt_order_1' } = req.body;

  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paisa
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('[Razorpay] Create Order Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

  try {
    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // 2. Update Order Status in Supabase
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', order_id);

    if (updateErr) throw updateErr;

    // 3. Record Payment Details
    await supabase.from('payments').insert([{
      order_id,
      payment_id: razorpay_payment_id,
      razorpay_order_id,
      status: 'completed',
      metadata: { signature: razorpay_signature }
    }]);

    res.json({ success: true, message: 'Payment verified and recorded' });
  } catch (error) {
    console.error('[Razorpay] Verify Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
