import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';
const CLIENT_EMAIL = 'customer@gmail.com';

async function testCheckout() {
  console.log('--- Testing Checkout & Inventory System ---');

  try {
    // 1. Get a product to test with
    const prodRes = await fetch(`${API_URL}/products`);
    const products = await prodRes.json();
    if (products.length === 0) throw new Error('No products found to test');
    
    const testProduct = products[0];
    const quantityToOrder = 2;

    console.log(`Testing with product: ${testProduct.name} (ID: ${testProduct.id})`);

    // 2. Perform Checkout
    console.log(`\nPlacing order for ${quantityToOrder} units...`);
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_email: CLIENT_EMAIL,
        items: [{ product_id: testProduct.id, quantity: quantityToOrder }]
      })
    });

    const orderData = await orderRes.json();
    
    if (!orderRes.ok) {
      console.error('Order Failed:', orderData.error);
    } else {
      console.log('✅ Order Success!', orderData);
      console.log(`Total: ${orderData.total}`);
    }

  } catch (error) {
    console.error('Test Error:', error.message);
  }

  console.log('\n--- Checkout Test Completed ---');
}

testCheckout();
