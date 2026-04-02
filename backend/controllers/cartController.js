import { supabase } from '../supabaseClient.js';

/**
 * Helper to get the internal client ID from the email in the auth token.
 */
const getClientId = async (email) => {
  const { data: client, error } = await supabase
    .from('clients')
    .select('id')
    .ilike('email', email)
    .maybeSingle();
  if (error || !client) return null;
  return client.id;
};

export const getCart = async (req, res) => {
  try {
    const clientId = await getClientId(req.user.email);
    if (!clientId) return res.json([]);

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('client_id', clientId);

    if (error) throw error;
    
    // Format to match frontend CartItem interface
    const formattedCart = data.map(item => ({
      id: item.products.id,
      name: item.products.name,
      price: parseFloat(item.products.price.toString().replace(/[^\d.]/g, '')),
      image: item.products.image || '',
      quantity: item.quantity
    }));

    res.json(formattedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  try {
    const clientId = await getClientId(req.user.email);
    if (!clientId) return res.status(404).json({ error: 'Client profile not found' });

    // Upsert logic: if exists, increment; else, insert.
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('client_id', clientId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert([{ client_id: clientId, product_id, quantity }]);
      if (error) throw error;
    }

    res.json({ success: true, message: 'Item added to persistent cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const clientId = await getClientId(req.user.email);
    if (!clientId) return res.status(404).json({ error: 'Client profile not found' });

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('client_id', clientId)
      .eq('product_id', product_id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { product_id } = req.params;
  try {
    const clientId = await getClientId(req.user.email);
    if (!clientId) return res.status(404).json({ error: 'Client profile not found' });

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('client_id', clientId)
      .eq('product_id', product_id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const syncCart = async (req, res) => {
  const { items } = req.body; // Array of { id: productId, quantity }
  try {
    const clientId = await getClientId(req.user.email);
    if (!clientId) return res.status(404).json({ error: 'Client profile not found' });

    for (const item of items) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('client_id', clientId)
        .eq('product_id', item.id)
        .maybeSingle();

      if (existing) {
        // If guest item exists in DB, we combine quantities
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('cart_items')
          .insert([{ client_id: clientId, product_id: item.id, quantity: item.quantity }]);
      }
    }

    res.json({ success: true, message: 'Local cart merged with database' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const clientId = await getClientId(req.user.email);
    if (!clientId) return res.status(404).json({ error: 'Client profile not found' });

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('client_id', clientId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
