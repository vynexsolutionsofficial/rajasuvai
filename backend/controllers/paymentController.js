import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '../supabaseClient.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a secure order with a 1.5% convenience fee and server-side validation.
 */
export const createOrder = async (req, res) => {
  const { items, address_id } = req.body;
  const userEmail = req.user.email;

  try {
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', userEmail)
      .single();

    if (clientErr || !client) return res.status(404).json({ error: 'User profile not found.' });

    let subtotal = 0;
    const orderItems = [];

    // 1. Validate Prices & Inventory
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', item.product_id)
        .single();

      if (!product) continue;
      const price = parseFloat(product.price.toString().replace(/[^\d.]/g, ''));
      subtotal += price * item.quantity;
      orderItems.push({ product_id: product.id, quantity: item.quantity, price_at_purchase: price });
    }

    // 2. Calculations
    const shipping = 50;
    const platformFeeRate = 0.015; // 1.5%
    const convenienceFee = Math.round((subtotal + shipping) * platformFeeRate);
    const finalTotal = subtotal + shipping + convenienceFee;

    // 3. Persistent Order
    const { data: dbOrder, error: dbOrderErr } = await supabase
      .from('orders')
      .insert([{
        client_id: client.id,
        address_id,
        total_price: finalTotal,
        status: 'pending_payment',
        metadata: { subtotal, shipping, convenienceFee }
      }])
      .select()
      .single();

    if (dbOrderErr) throw dbOrderErr;

    // 4. Order Items
    await supabase.from('order_items').insert(orderItems.map(i => ({ ...i, order_id: dbOrder.id })));

    // 5. Razorpay Order
    const razorOrder = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100),
      currency: 'INR',
      receipt: `receipt_${dbOrder.id}`,
    });

    res.json({
      success: true,
      razorOrder,
      dbOrderId: dbOrder.id,
      breakdown: { subtotal, shipping, convenienceFee, finalTotal }
    });

  } catch (err) {
    console.error('SECURE_CHECKOUT_ERROR:', err);
    res.status(500).json({ error: 'Checkout initialization failed.' });
  }
};

/**
 * Standard Verification (Client-side trigger)
 */
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Invalid Payment Token' });
  }

  try {
    await fulfillOrder(dbOrderId, razorpay_payment_id, razorpay_order_id, req.body.method || 'online');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Order fulfillment failed but payment verified.' });
  }
};

/**
 * Webhook Handler (Fail-safe)
 */
export const handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'raj_suvai_secret';
  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) return res.status(403).send('Forbidden');

  const { event, payload } = req.body;
  const payment = payload.payment.entity;
  const receipt = payload.order?.entity?.receipt || '';
  const dbOrderId = receipt.replace('receipt_', '');

  if (event === 'payment.captured' && dbOrderId) {
     await fulfillOrder(dbOrderId, payment.id, payment.order_id, payment.method);
  }

  res.json({ status: 'ok' });
};

/**
 * Helper: Deducts inventory and marks order as paid
 */
async function fulfillOrder(dbOrderId, paymentId, razorOrderId, method) {
  // Update Order
  await supabase.from('orders').update({ status: 'paid' }).eq('id', dbOrderId);

  // Record Payment
  await supabase.from('payments').insert([{
    order_id: dbOrderId,
    payment_id: paymentId,
    razorpay_order_id: razorOrderId,
    status: 'completed',
    method: method
  }]);

  // Inventory logic...
  const { data: items } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', dbOrderId);
  for (const item of items) {
    const { data: inv } = await supabase.from('inventory').select('quantity').eq('product_id', item.product_id).single();
    if (inv) {
        await supabase.from('inventory').update({ quantity: inv.quantity - item.quantity }).eq('product_id', item.product_id);
    }
  }

  // Clear cart
  const { data: order } = await supabase.from('orders').select('client_id').eq('id', dbOrderId).single();
  if (order) {
    await supabase.from('cart_items').delete().eq('client_id', order.client_id);
  }
}
