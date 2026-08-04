-- Migration 150: re-apply the support_tickets INSERT policy.
--
-- After running APPLY_NOW.sql, live verification showed every other change had
-- landed (cart_items, sales, orders/payments columns, newsletter policy) but
-- INSERT on support_tickets still returned 42501 "new row violates row-level
-- security policy". The policy from migration 120 did not end up in place —
-- most likely an existing RESTRICTIVE policy on the table, or the CREATE POLICY
-- being skipped. This re-applies it explicitly and drops any conflicting
-- restrictive policy first.
--
-- Safe to re-run.

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Remove any prior policies on this table so a leftover RESTRICTIVE policy
-- can't keep blocking inserts (restrictive policies are AND-ed, so a single
-- one that evaluates false blocks everything regardless of permissive ones).
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'support_tickets'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.support_tickets', pol.policyname);
  END LOOP;
END $$;

-- Insert-only for the public roles: the Contact Us form must be able to file a
-- ticket, but nobody using the anon key should be able to read other people's
-- support messages back out.
CREATE POLICY "Public can file support tickets"
  ON support_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify: this should return one row named "Public can file support tickets".
-- SELECT policyname, cmd, roles FROM pg_policies
--  WHERE schemaname='public' AND tablename='support_tickets';
