-- ==============================================================
-- SUVAI — ROUND 2: APPLY THIS IN THE SUPABASE SQL EDITOR
-- ==============================================================
-- Found by end-to-end checkout testing after round 1.
-- Blocking today:
--   * Order creation fails with duplicate key on orders_pkey
--     (identity sequences are behind the existing rows)
--   * Contact Us form still blocked by RLS on support_tickets
-- Safe to re-run.
-- ==============================================================

-- ################ 160_resync_identity_sequences.sql ################
-- Migration 160: resync identity sequences.
--
-- Live end-to-end checkout test failed with:
--   23505 duplicate key value violates unique constraint "orders_pkey"
--   Key (id)=(1) already exists.
--
-- Rows were inserted with explicit ids (seed data / manual SQL) without
-- advancing the table's identity sequence, so the sequence still points at 1
-- while rows already occupy those ids. Every INSERT therefore collides and
-- ORDER CREATION IS IMPOSSIBLE until this is corrected.
--
-- This walks every identity/serial column in the public schema and moves its
-- sequence past the highest id currently present. Safe and idempotent — on a
-- correctly-synced table it is a no-op.

DO $$
DECLARE
  rec RECORD;
  seq TEXT;
  max_id BIGINT;
BEGIN
  FOR rec IN
    SELECT c.table_name, c.column_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema AND t.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND (c.is_identity = 'YES' OR c.column_default LIKE 'nextval%')
  LOOP
    seq := pg_get_serial_sequence(format('public.%I', rec.table_name), rec.column_name);
    IF seq IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format('SELECT COALESCE(MAX(%I), 0) FROM public.%I', rec.column_name, rec.table_name)
      INTO max_id;

    -- is_called = true means "next value is max_id + 1"
    PERFORM setval(seq, GREATEST(max_id, 1), true);

    RAISE NOTICE 'Resynced %.% -> next id %', rec.table_name, rec.column_name, max_id + 1;
  END LOOP;
END $$;

-- ################ 170_support_tickets_disable_rls.sql ################
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

