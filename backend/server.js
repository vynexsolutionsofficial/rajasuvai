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

dotenv.config();

const app = express();
const PORT = 3000; // Forced to 3000 for consistency with frontend

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rajasuvai Backend is running' });
});

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
    // 1. Get Client ID and Phone
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id, phone, name, email')
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

    // 6. Send Confirmation Email
    if (client.email) {
      await sendOrderEmail(client.email, client.name, order.id, totalPrice);
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

// --- ADMIN ORDER STATUS UPDATE ---

app.post('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Update Order Status
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('id, client_id')
      .single();

    if (orderErr) throw orderErr;

    // 2. Fetch Client Info
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('name, email')
      .eq('id', order.client_id)
      .single();

    if (!clientErr && client && client.email) {
      await sendOrderStatusEmail(client.email, client.name, order.id, status);
    }

    res.json({ message: `Order status updated to ${status}`, orderId: id });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
