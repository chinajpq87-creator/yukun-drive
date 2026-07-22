# OPC AI Motion Solution Platform

OPC V1 is an Astro and Supabase platform for presenting component-based Motion Solutions and collecting customer inquiries.

## V1 scope

- Market Demand management
- Component library management
- Motion Solution and component BOM management
- Published public solution pages
- Customer inquiry collection and manual status handling
- Prominent product-and-solution contact channel: `chinajpq@outlook.com`

Supplier records, supplier contact information, supplier matching, email automation, and AI replies are intentionally outside this application.

## Local setup

1. Copy `.env.example` to `.env`.
2. Create a Supabase project and add its URL, publishable key, and server-only service role key to `.env`.
3. Apply `supabase/migrations/001_core_schema.sql` and `supabase/migrations/002_rls_policies.sql` in the Supabase SQL Editor, or through a linked Supabase CLI project.
4. For local demonstration data, apply `supabase/seed.sql` after the migrations.
5. Create your first Auth user in Supabase and set `app_metadata.role` to `admin`.
6. Start the site with `npm.cmd run dev` on Windows, or `npm run dev` on macOS/Linux.

## Commands

```bash
npm run check
npm run test
npm run build
```

When Astro is run in a locked-down Windows environment that cannot write its telemetry profile, execute the command with `ASTRO_TELEMETRY_DISABLED=1` (PowerShell: `$env:ASTRO_TELEMETRY_DISABLED='1'`).

## Routes

- `/` — platform introduction and contact CTA
- `/solutions` — published Motion Solutions
- `/solutions/[slug]` — solution detail, BOM, and inquiry form
- `/components` — public component library
- `/admin/login` — administrator sign-in
- `/admin/demands`, `/admin/components`, `/admin/solutions`, `/admin/inquiries` — protected content workspaces

## Inquiry workflow

`new → reviewing → quoted → closed`

The inquiry endpoint validates a submitted solution is published before creating a `customer_inquiries` row. It does not send AI or email responses; follow-up is manual.
