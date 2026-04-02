-- migration_v10_performance_indexes.sql
-- Optimizing common fetch paths for High-Velocity commerce

-- 1. Products Table: Speed up filtering by category and price
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price_numeric ON products(price_numeric);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 2. Cart Items: Speed up cart retrieval/sync for logged-in users
CREATE INDEX IF NOT EXISTS idx_cart_items_client_id ON cart_items(client_id);

-- 3. Orders: Speed up order history for profile page
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 4. Clients: Speed up login and auth bypass
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- 5. Products Full Text Search (Optional but recommended for speed)
-- If using ilike everywhere, this btree index helps with prefix matches
CREATE INDEX IF NOT EXISTS idx_products_name_lower ON products(lower(name));
