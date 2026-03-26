import { supabase } from '../supabaseClient.js';

const sampleSpices = [
  {
    name: 'Star Anise',
    price: '₹380',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
    description: 'Beautiful star-shaped spice with a deep licorice-like aroma.'
  },
  {
    name: 'Ceylon Cinnamon',
    price: '₹520',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
    description: 'Thin, delicate quills of authentic Sri Lankan cinnamon.'
  },
  {
    name: 'Premium Cloves',
    price: '₹410',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
    description: 'Strong, pungent cloves with high essential oil content.'
  },
  {
    name: 'Whole Nutmeg',
    price: '₹290',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
    description: 'Highly aromatic whole nutmegs, perfect for fresh grating.'
  }
];

async function seedData() {
  console.log('Seeding comprehensive spice data...');
  
  const { data, error } = await supabase
    .from('products')
    .insert(sampleSpices)
    .select();

  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log(`Successfully seeded ${data.length} new spices!`);
    console.log('Check your website to see the new collection live.');
  }
}

seedData();
