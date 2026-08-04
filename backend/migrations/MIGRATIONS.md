# Migrations

Files are numbered in the order they were originally authored (by file
timestamp), consolidated here from a mix of loose root-level SQL files and a
`migrations/` folder that only had two of them. Renamed for ordering only —
contents are unchanged.

| File | Purpose |
|---|---|
| `000_setup_base_schema.sql` | Base schema (products, categories, clients, inventory, orders, etc.) |
| `010_admin_panel.sql` | Admin panel tables/columns |
| `020_order_management.sql` | Order management tables/columns |
| `030_payments_and_coupons.sql` | Initial payments + coupons support |
| `035_addresses_rls.sql` | RLS policies for the `addresses` table |
| `040_payments_table.sql` | `payments` table |
| `050_coupons_table.sql` | `coupons` table |
| `060_price_numeric.sql` | Adds numeric price column/support for sorting |
| `070_performance_indexes.sql` | Indexes for common fetch paths |
| `080_support_and_settings.sql` | `support_tickets`, `site_settings` tables |
| `090_admin_completion.sql` | `is_active` flag on `clients`, storage bucket policy notes |
| `100_price_tiers.sql` | `bulk_rate`, `wholesale_price` columns on `products` |
| `110_product_details.sql` | `size_g` and other product detail columns |
| `120_support_tickets_public_insert.sql` | RLS INSERT policy so guests can submit the public Contact Us form |
| `130_newsletter_subscribers.sql` | Creates the missing `newsletter_subscribers` table + RLS INSERT policy |
| `seed_dummy_data.sql` | Sample/seed data — not a schema migration, run only for local dev seeding |

## Known gaps and caveats

- **No `v8`/`v9` files exist** — either never created or lost before this
  cleanup. No functional gap is known, but if a future migration references
  columns that don't seem to exist anywhere else in this folder, that's likely
  why.
- **`000_setup_base_schema.sql` (formerly `setup.sql`) already contains
  columns that `100_price_tiers.sql`/`110_product_details.sql` also add**
  (e.g. `bulk_rate`, `wholesale_price`, `size_g` on `products`, both guarded
  with `ADD COLUMN IF NOT EXISTS` in the later files). This means
  `000_setup_base_schema.sql` was likely updated at some point to reflect the
  schema *after* those migrations landed, rather than being a literal
  from-scratch v1 — treat it as "what a fresh project should end up with,"
  not strictly "run this first, unmodified, on day one."
- **Apply status against the live Supabase project is unknown** for
  `000`–`110`. There is no `schema_migrations` (or similar) tracking table in
  this project, so there's no record of what has actually been run. Most are
  written with `IF NOT EXISTS` guards, so they're safe to re-run against a
  schema that already has some of them applied — compare column-by-column via
  the Supabase SQL Editor if in doubt.
- **`120` and `130` are confirmed NOT applied and are needed now.** The
  Supabase project came back online partway through the redesign work (it had
  been unreachable — see project notes) and live-testing surfaced two real
  gaps: (1) `POST /api/support` (the public Contact Us form) fails with a row
  level security violation because `support_tickets` has no INSERT policy,
  and (2) `POST /api/newsletter` (Footer subscribe form) fails because
  `newsletter_subscribers` doesn't exist in the live schema at all. Run
  `120_support_tickets_public_insert.sql` and `130_newsletter_subscribers.sql`
  in the Supabase SQL Editor to fix both.
