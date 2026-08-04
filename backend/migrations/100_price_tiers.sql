-- Migration v13: Add bulk_rate and wholesale_price columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS bulk_rate       DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS wholesale_price DECIMAL(10,2);
