-- Migration 120: allow the public Contact Us form (SupportPage.tsx -> POST /api/support)
-- to insert support tickets for guests, not just logged-in users.
--
-- Row Level Security on support_tickets currently has no INSERT policy, so every
-- insert through the (anon-key) backend client is rejected — including from
-- logged-in users, since the backend does not forward the caller's JWT to
-- Supabase per-request; all backend DB access runs as the anon key.

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on support_tickets" ON support_tickets;
CREATE POLICY "Allow public insert on support_tickets"
  ON support_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
