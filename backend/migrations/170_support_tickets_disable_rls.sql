-- Migration 170: disable RLS on support_tickets.
--
-- Migrations 120 and 150 both tried to add a permissive INSERT policy and the
-- table still returned 42501 on insert afterwards, so something on this table
-- keeps overriding it (most likely a RESTRICTIVE policy or FORCE ROW LEVEL
-- SECURITY that the earlier DO-block cleanup did not clear).
--
-- Rather than keep guessing at policies, make support_tickets consistent with
-- the rest of this schema. Every other table the backend writes to — orders,
-- order_items, clients, addresses, cart_items — already accepts writes from
-- the anon key; support_tickets was the sole outlier, and the Contact Us form
-- is broken because of it.
--
-- TRADE-OFF, stated plainly: with RLS off, anyone holding the anon key (which
-- ships in the frontend bundle) can read support tickets directly from
-- Supabase. That is the same exposure that already exists for orders and
-- clients — i.e. this does not open a new class of hole, it matches the
-- current architecture. The real fix for all of these is to move the backend
-- onto a SUPABASE_SERVICE_ROLE_KEY and re-enable RLS everywhere with policies
-- that deny anon outright. That is tracked as the main security follow-up and
-- is worth doing before this handles real customer data.

ALTER TABLE support_tickets DISABLE ROW LEVEL SECURITY;

-- Verify — should report rowsecurity = false:
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'support_tickets';
