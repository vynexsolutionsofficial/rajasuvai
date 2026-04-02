-- SUVAI ADMIN PANEL DUMMY DATA SEED SCRIPT
-- Run this in the Supabase SQL Editor to populate your database with test data.

-- 1. Insert Dummy Categories (if not exists)
INSERT INTO categories (name) VALUES 
('Organic Spices'), 
('Traditional Grains'), 
('Himalayan Salts'), 
('Cold Pressed Oils'),
('Homemade Pickles')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Dummy Products
-- We'll use IDs 100+ for dummy data to avoid conflict with initial records
INSERT INTO products (name, price, category, category_id, image, description, sku, status) VALUES
('Premium Saffron', '2500', 'Organic Spices', (SELECT id FROM categories WHERE name = 'Organic Spices'), 'https://images.unsplash.com/photo-1626200419199-341bf65b5cb1?w=800', 'Original Kashmiri Kesar for premium flavor.', 'SKU-SAF-001', 'active'),
('Black Cumin', '450', 'Organic Spices', (SELECT id FROM categories WHERE name = 'Organic Spices'), 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800', 'High-aroma black cumin seeds.', 'SKU-CUM-002', 'active'),
('Basmati Rice 5kg', '850', 'Traditional Grains', (SELECT id FROM categories WHERE name = 'Traditional Grains'), 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', 'Long grain aged basmati rice.', 'SKU-RIC-003', 'active'),
('Pink Himalayan Salt', '180', 'Himalayan Salts', (SELECT id FROM categories WHERE name = 'Himalayan Salts'), 'https://images.unsplash.com/photo-1626200419199-341bf65b5cb1?w=800', 'Refined pink salt from Himalayan mines.', 'SKU-SALT-004', 'active'),
('Wood Pressed Groundnut Oil', '720', 'Cold Pressed Oils', (SELECT id FROM categories WHERE name = 'Cold Pressed Oils'), 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?w=800', 'Pure wood pressed oil for healthy cooking.', 'SKU-OIL-005', 'active'),
('Spicy Mango Pickle', '220', 'Homemade Pickles', (SELECT id FROM categories WHERE name = 'Homemade Pickles'), 'https://images.unsplash.com/photo-1589135398309-0d44f5922384?w=800', 'Traditional spicy mango pickle.', 'SKU-PIC-006', 'active'),
('Star Anise', '580', 'Organic Spices', (SELECT id FROM categories WHERE name = 'Organic Spices'), 'https://images.unsplash.com/photo-1596450514735-3165b4081c7e?w=800', 'Whole star anise for flavoring.', 'SKU-ANI-007', 'active'),
('Dry Red Chili (Whole)', '350', 'Organic Spices', (SELECT id FROM categories WHERE name = 'Organic Spices'), 'https://images.unsplash.com/photo-1580210301063-da1204d88e6e?w=800', 'Sun-dried premium red chilies.', 'SKU-CHL-008', 'inactive'),
('Brown RAGI', '160', 'Traditional Grains', (SELECT id FROM categories WHERE name = 'Traditional Grains'), 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'High-calcium organic ragi.', 'SKU-RAG-009', 'active'),
('Virgin Coconut Oil', '890', 'Cold Pressed Oils', (SELECT id FROM categories WHERE name = 'Cold Pressed Oils'), 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', 'Pure virgin coconut oil.', 'SKU-VCO-010', 'active')
ON CONFLICT (sku) DO NOTHING;

-- 3. Seed Inventory for Dummy Products
INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, FLOOR(RANDOM() * 100 + 5), 10
FROM products
WHERE sku LIKE 'SKU-%'
ON CONFLICT (product_id) DO NOTHING;

-- 4. Insert Dummy Clients
INSERT INTO clients (name, email, password_hash, phone, address, role) VALUES
('Rahul Sharma', 'rahul.test@example.com', '$2b$10$dummyhash', '+91 9988776655', 'House 12, MG Road, Bangalore', 'customer'),
('Priya Patel', 'priya.test@example.com', '$2b$10$dummyhash', '+91 8877665544', 'Flat 402, Skyline Apts, Mumbai', 'customer'),
('Amit Kumar', 'amit.test@example.com', '$2b$10$dummyhash', '+91 7766554433', 'Plot 5, Sector 18, Gurgaon', 'customer'),
('Sneha Reddy', 'sneha.test@example.com', '$2b$10$dummyhash', '+91 6655443322', 'Door 8, Jubilee Hills, Hyderabad', 'customer'),
('Vikram Singh', 'vikram.test@example.com', '$2b$10$dummyhash', '+91 5544332211', 'Block C, Salt Lake, Kolkata', 'customer')
ON CONFLICT (email) DO NOTHING;

-- 5. Insert Dummy Orders
-- We'll link these to the clients we just created
DO $$
DECLARE
    client_id_1 BIGINT;
    client_id_2 BIGINT;
    client_id_3 BIGINT;
    order_id_1 BIGINT;
    order_id_2 BIGINT;
    order_id_3 BIGINT;
    order_id_4 BIGINT;
    prod_id_1 BIGINT;
    prod_id_2 BIGINT;
BEGIN
    SELECT id INTO client_id_1 FROM clients WHERE email = 'rahul.test@example.com';
    SELECT id INTO client_id_2 FROM clients WHERE email = 'priya.test@example.com';
    SELECT id INTO client_id_3 FROM clients WHERE email = 'amit.test@example.com';
    
    SELECT id INTO prod_id_1 FROM products WHERE sku = 'SKU-SAF-001';
    SELECT id INTO prod_id_2 FROM products WHERE sku = 'SKU-RIC-003';

    -- Order 1: Delivered (10 days ago)
    INSERT INTO orders (client_id, status, total_price, created_at) 
    VALUES (client_id_1, 'Delivered', 3350.00, NOW() - INTERVAL '10 days') RETURNING id INTO order_id_1;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (order_id_1, prod_id_1, 1, 2500.00), (order_id_1, prod_id_2, 1, 850.00);
    INSERT INTO payments (order_id, transaction_id, amount, status, provider, created_at) VALUES (order_id_1, 'TXN_DUMMY_101', 3350.00, 'Success', 'Razorpay', NOW() - INTERVAL '10 days');

    -- Order 2: Shipped (2 days ago)
    INSERT INTO orders (client_id, status, total_price, created_at) 
    VALUES (client_id_2, 'Shipped', 450.00, NOW() - INTERVAL '2 days') RETURNING id INTO order_id_2;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (order_id_2, (SELECT id FROM products WHERE sku = 'SKU-CUM-002'), 1, 450.00);
    INSERT INTO payments (order_id, transaction_id, amount, status, provider, created_at) VALUES (order_id_2, 'TXN_DUMMY_102', 450.00, 'Success', 'Razorpay', NOW() - INTERVAL '2 days');

    -- Order 3: Pending (Recent)
    INSERT INTO orders (client_id, status, total_price, created_at) 
    VALUES (client_id_3, 'Pending', 720.00, NOW() - INTERVAL '1 hour') RETURNING id INTO order_id_3;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (order_id_3, (SELECT id FROM products WHERE sku = 'SKU-OIL-005'), 1, 720.00);

    -- Order 5: Historical (1 month ago)
    INSERT INTO orders (client_id, status, total_price, created_at) 
    VALUES (client_id_2, 'Delivered', 1200.00, NOW() - INTERVAL '1 month') RETURNING id INTO order_id_1;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (order_id_1, prod_id_2, 2, 600.00);
    INSERT INTO payments (order_id, transaction_id, amount, status, provider, created_at) VALUES (order_id_1, 'TXN_HIST_1', 1200.00, 'Success', 'Razorpay', NOW() - INTERVAL '1 month');

    -- Order 6: Historical (2 months ago)
    INSERT INTO orders (client_id, status, total_price, created_at) 
    VALUES (client_id_3, 'Delivered', 2500.00, NOW() - INTERVAL '2 months') RETURNING id INTO order_id_1;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (order_id_1, prod_id_1, 1, 2500.00);
    INSERT INTO payments (order_id, transaction_id, amount, status, provider, created_at) VALUES (order_id_1, 'TXN_HIST_2', 2500.00, 'Success', 'Razorpay', NOW() - INTERVAL '2 months');

    -- Order 4: Cancelled
    INSERT INTO orders (client_id, status, total_price, created_at) 
    VALUES (client_id_1, 'Cancelled', 220.00, NOW() - INTERVAL '5 days') RETURNING id INTO order_id_4;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (order_id_4, (SELECT id FROM products WHERE sku = 'SKU-PIC-006'), 1, 220.00);
    INSERT INTO payments (order_id, transaction_id, amount, status, provider) VALUES (order_id_4, 'TXN_DUMMY_103', 220.00, 'Failed', 'Razorpay');
END $$;

-- 6. Add Sales records for Success payments
INSERT INTO sales (order_id, total_amount, created_at)
SELECT order_id, amount, created_at FROM payments WHERE status = 'Success'
ON CONFLICT DO NOTHING;

-- 7. Add some extra Coupons for testing
INSERT INTO coupons (code, discount_type, value, expiry_date, status) VALUES 
('FESTIVE20', 'percentage', 20.00, NOW() + INTERVAL '30 days', 'active'),
('SAVE100', 'fixed', 100.00, NOW() + INTERVAL '10 days', 'active'),
('EXPIRED50', 'percentage', 50.00, NOW() - INTERVAL '1 day', 'inactive')
ON CONFLICT (code) DO NOTHING;
