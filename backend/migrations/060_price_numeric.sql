-- MIGRATION V7: Price Numeric Support
-- Run this in the Supabase SQL Editor

-- 1. Add price_numeric column
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_numeric DECIMAL(10, 2);

-- 2. Populate price_numeric from the TEXT price (e.g. '₹250' -> 250.00)
-- This regex removes everything except numbers and decimals
UPDATE products 
SET price_numeric = CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL(10, 2))
WHERE price_numeric IS NULL;

-- 3. Verify
SELECT id, name, price, price_numeric FROM products LIMIT 5;
