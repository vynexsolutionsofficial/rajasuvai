-- Migration v14: Add product detail columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS size_g INTEGER,
  ADD COLUMN IF NOT EXISTS mrp DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS offer TEXT,
  ADD COLUMN IF NOT EXISTS kg DECIMAL(10,2);
