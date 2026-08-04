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
