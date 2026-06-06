import { supabase } from '../supabaseClient.js';

// Change this to the email you used to log in / sign up
const TARGET_EMAIL = 'YOUR_REAL_EMAIL@gmail.com'; 

async function makeAdmin() {
  console.log(`--- Promoting ${TARGET_EMAIL} to Admin ---`);

  const { error } = await supabase
    .from('clients')
    .update({ role: 'admin' })
    .eq('email', TARGET_EMAIL);

  if (error) {
    console.error('Error promoting to admin:', error.message);
  } else {
    console.log('✅ Success! The user is now an Admin.');
  }
}

makeAdmin();
