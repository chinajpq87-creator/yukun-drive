# Database Operations

The Supabase CLI recognizes migrations in `supabase/migrations/`. The `database/` directory is reserved for human-facing database operation notes.

## Apply the schema

Run the files below in order in the Supabase SQL Editor:

1. `supabase/migrations/001_core_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/seed.sql` only for a local/demo environment

## Administrator access

The policies check `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`. Create an Auth user and assign that app metadata through a secure Supabase administrative operation before accessing `/admin`.

## Public data boundary

- Visitors can read only rows where `motion_solutions.status = 'published'`.
- Visitors can read only rows where `components.is_public = true`.
- Visitor inquiry submission always goes through the Astro server endpoint, which validates the request before using the server-only Supabase key.
- No table, view, column, policy, or seed record contains supplier information.
