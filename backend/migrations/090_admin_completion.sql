-- Migration v12: Admin completion features
-- Adds is_active flag to clients for enable/disable, ensures storage bucket policy notes

-- 1. Add is_active to clients (soft enable/disable)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Index for faster admin user filtering
CREATE INDEX IF NOT EXISTS clients_role_idx ON clients(role);
CREATE INDEX IF NOT EXISTS clients_active_idx ON clients(is_active);

-- 3. Storage bucket for product images (run in Supabase Dashboard if needed):
--    Storage > New bucket > name=product-images > Public
--    Then add policy: Allow anyone to SELECT, authenticated to INSERT/UPDATE/DELETE
