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
| `140_checkout_schema_reconciliation.sql` | Creates `cart_items` + `sales`, adds missing `orders`/`payments` columns, relaxes the order status constraint |
| **`APPLY_NOW.sql`** | **120 + 130 + 140 combined — paste this into the Supabase SQL Editor** |
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
- **Migrations `040`–`110` were authored but never applied to this project.**
  Determined empirically on 2026-08-04 by probing the live schema: `payments`
  is missing `payment_id`/`razorpay_order_id`/`method` (all defined in `040`),
  and the `cart_items`/`sales` tables were never created by any migration at
  all despite the code depending on them.

- **`120`, `130` and `140` are confirmed NOT applied and are required now.**
  Run **`APPLY_NOW.sql`** (all three combined) in the Supabase SQL Editor.
  Until then these user-facing flows are broken in production:
  - **Checkout fails entirely** — `createOrder` writes `orders.address_id` and
    `orders.metadata`, neither of which exists, and the status values it uses
    (`pending_payment`, `paid`) violate the `orders_status_check` constraint.
  - **The logged-in cart is dead** — `cart_items` does not exist, so every
    `/api/cart` route and the post-payment cart clear fail.
  - **Admin dashboard revenue always reads ₹0** — it sums `sales.total_amount`
    and the `sales` table does not exist.
  - Contact Us form (RLS) and newsletter signup (missing table) both 500.

- **Separately fixed in code (not schema):** `paymentController.createOrder`
  was inserting `order_items.price_at_purchase`, a column that does not exist
  and never did — the schema and every read path use `unit_price`. That insert
  was also unchecked, so it failed silently and produced orders with no line
  items rather than surfacing an error.
