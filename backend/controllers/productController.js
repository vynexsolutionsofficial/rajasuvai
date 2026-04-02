import { supabase } from '../supabaseClient.js';

export const getProducts = async (req, res) => {
  const { category, priceMin, priceMax, offset, limit } = req.query;
  
  try {
    let query = supabase.from('products').select('*', { count: 'exact' });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (priceMin) query = query.gte('price_numeric', priceMin);
    if (priceMax) query = query.lte('price_numeric', priceMax);

    if (offset && limit) {
      const from = parseInt(offset);
      const to = from + parseInt(limit) - 1;
      query = query.range(from, to).order('id', { ascending: true });
    }

    const { data, count, error } = await query;

    if (error) throw error;
    res.json({ products: data, total: count });
  } catch (error) {
    console.error('FETCH_PRODUCTS_ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name), inventory(quantity)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
