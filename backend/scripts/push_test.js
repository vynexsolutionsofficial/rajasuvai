import { supabase } from '../supabaseClient.js';

async function pushTestProduct() {
  const newProduct = {
    name: 'Exotic Saffron',
    price: '₹1450',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
    description: 'Pure Grade-A Kashmiri Saffron strands.'
  };

  console.log('Pushing new product to Supabase...');
  
  const { data, error } = await supabase
    .from('products')
    .insert([newProduct])
    .select();

  if (error) {
    console.error('Error pushing product:', error.message);
  } else {
    console.log('Successfully pushed product:', data[0].name);
    console.log('Your frontend should have updated in REALTIME!');
  }
}

pushTestProduct();
