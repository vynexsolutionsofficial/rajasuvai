import { supabase } from '../supabaseClient.js';

// --- ADDRESS CONTROLLERS ---

export const getAddresses = async (req, res) => {
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', req.user.email)
      .maybeSingle();

    if (!client) return res.json([]);

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('client_id', client.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAddress = async (req, res) => {
  const { full_name, phone, pincode, address_line1, address_line2, city, state, tag, is_default } = req.body;
  
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', req.user.email)
      .maybeSingle();

    if (!client) return res.status(404).json({ error: 'Client not found' });

    // Handle is_default logic
    if (is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('client_id', client.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        client_id: client.id,
        full_name, phone, pincode, address_line1, address_line2, city, state, tag, is_default
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // 1. Verify ownership
    const { data: existing } = await supabase
      .from('addresses')
      .select('client_id')
      .eq('id', id)
      .single();

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', req.user.email)
      .maybeSingle();

    if (!existing || !client || existing.client_id !== client.id) {
      return res.status(403).json({ error: 'Unauthorized to update this address' });
    }

    if (updates.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('client_id', client.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Verify ownership
    const { data: existing } = await supabase.from('addresses').select('client_id').eq('id', id).single();
    const { data: client } = await supabase.from('clients').select('id').ilike('email', req.user.email).maybeSingle();

    if (!existing || !client || existing.client_id !== client.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this address' });
    }

    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
