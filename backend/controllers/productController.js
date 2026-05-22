import { supabase } from '../supabaseClient.js';

export const getProducts = async (req, res) => {
  const { category, priceMin, priceMax, offset, limit, search, sort } = req.query;

  try {
    let query = supabase
      .from('products')
      .select('*, inventory(quantity)', { count: 'exact' });

    // Filter by category via category_id (look up by name first)
    if (category && category !== 'All') {
      const { data: catRow } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category)
        .single();
      // If category not found return empty result set
      query = query.eq('category_id', catRow ? catRow.id : -1);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (priceMin) query = query.gte('price_numeric', priceMin);
    if (priceMax) query = query.lte('price_numeric', priceMax);

    // Sorting
    if (sort === 'price_asc') {
      query = query.order('price_numeric', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price_numeric', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('id', { ascending: true });
    }

    if (offset && limit) {
      const from = parseInt(offset);
      const to = from + parseInt(limit) - 1;
      query = query.range(from, to);
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
