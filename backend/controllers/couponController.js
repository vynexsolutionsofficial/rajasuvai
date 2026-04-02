import { supabase } from '../supabaseClient.js';

// --- COUPON CONTROLLERS ---

export const verifyCoupon = async (req, res) => {
  const { code } = req.params;
  const { cartTotal } = req.query;

  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', code)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    // Check minimum purchase
    if (cartTotal && Number(cartTotal) < coupon.min_purchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of ₹${coupon.min_purchase} required for this offer.` 
      });
    }

    res.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
