# OPC V1 Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Astro, TypeScript, and Supabase platform that publishes product Motion Solutions and collects customer inquiries without storing supplier information.

**Architecture:** Astro runs in SSR mode for public pages, the protected admin interface, and the inquiry endpoint. Supabase provides Auth and PostgreSQL with RLS; the server API validates every public inquiry before persistence. Market demands lead to solutions, solutions include component BOM entries, and published solutions receive inquiries.

**Tech Stack:** Astro, TypeScript, Astro Node adapter, Supabase JS, PostgreSQL, Vitest, Playwright.

## Global Constraints

- Do not create, store, display, or link supplier data in this project.
- Public contact copy must label `chinajpq@outlook.com` as “产品与方案咨询”, never as a supplier email.
- Public users read only published solutions and public components; only authenticated administrators manage data and inquiries.
- Public inquiry creation goes through the Astro server endpoint; no browser-side service-role key and no direct anonymous table insert.
- V1 excludes AI replies, email sending, automated research, uploads, dashboards, and complex search.
- The current directory is not a valid Git repository; do not attempt commits until the user initializes one.

---

## File Structure

```text
OPC-Motion-Solution/
├── database/README.md
├── supabase/
│   ├── migrations/001_core_schema.sql
│   ├── migrations/002_rls_policies.sql
│   └── seed.sql
├── src/
│   ├── components/{ContactCta,InquiryForm,SolutionCard}.astro
│   ├── layouts/{BaseLayout,AdminLayout}.astro
│   ├── lib/supabase/{browser,server}.ts
│   ├── pages/{index,components,solutions/index,solutions/[slug]}.astro
│   ├── pages/admin/{index,login,demands,components,solutions,inquiries}.astro
│   ├── pages/api/inquiries.ts
│   ├── services/{inquiries,solutions}.ts
│   ├── types/database.ts
│   └── validation/inquiry.ts
├── tests/{unit,integration,e2e}/
├── .env.example
├── astro.config.mjs
└── package.json
```

### Task 1: Scaffold the SSR Astro application and test runners

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.env.example`, `src/env.d.ts`
- Create: `src/pages/index.astro`, `src/styles/global.css`, `vitest.config.ts`, `playwright.config.ts`
- Test: `tests/e2e/home.spec.ts`

**Produces:** `npm run dev`, `npm run test`, `npm run test:e2e`, and an SSR Astro application.

- [ ] **Step 1: Create the project and install runtime dependencies**

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
npm install @astrojs/node @supabase/ssr @supabase/supabase-js zod
npm install -D vitest @playwright/test
```

- [ ] **Step 2: Configure SSR and the environment contract**

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

```dotenv
# .env.example
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_CONTACT_EMAIL=chinajpq@outlook.com
```

- [ ] **Step 3: Write the failing home-page test**

```ts
// tests/e2e/home.spec.ts
import { expect, test } from '@playwright/test';

test('home page exposes the product-and-solution contact email', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /chinajpq@outlook.com/i })).toBeVisible();
});
```

- [ ] **Step 4: Run the test and verify it fails before the page exists**

Run: `npx playwright test tests/e2e/home.spec.ts`

Expected: failure because the home page does not yet contain the contact link.

- [ ] **Step 5: Implement the minimal page, then run quality gates**

```astro
---
import '../styles/global.css';
const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL;
---
<main>
  <h1>We solve motion challenges for smart products.</h1>
  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
</main>
```

Run: `npm run check && npm run test && npx playwright test tests/e2e/home.spec.ts`

Expected: type checks and tests pass.

### Task 2: Establish domain types and server-side inquiry validation

**Files:**
- Create: `src/types/domain.ts`, `src/validation/inquiry.ts`
- Test: `tests/unit/inquiry.test.ts`

**Consumes:** no application services.

**Produces:** `inquirySchema` and `InquiryInput` used by the API route.

- [ ] **Step 1: Write failing validation tests**

```ts
import { describe, expect, it } from 'vitest';
import { inquirySchema } from '../../src/validation/inquiry';

describe('inquirySchema', () => {
  it('accepts a complete inquiry with a positive quantity', () => {
    expect(inquirySchema.parse({
      solutionId: 'c0a80121-0000-4000-8000-000000000001',
      customerName: 'Ada Lovelace', email: 'ada@example.com',
      requirementDescription: 'Need a compact lock actuator.', requiredQuantity: 100,
    }).requiredQuantity).toBe(100);
  });

  it('rejects a non-positive quantity', () => {
    expect(() => inquirySchema.parse({
      solutionId: 'c0a80121-0000-4000-8000-000000000001',
      customerName: 'Ada Lovelace', email: 'ada@example.com',
      requirementDescription: 'Need a compact lock actuator.', requiredQuantity: 0,
    })).toThrow();
  });
});
```

- [ ] **Step 2: Run the unit test and verify it fails**

Run: `npx vitest run tests/unit/inquiry.test.ts`

Expected: failure because `inquirySchema` is not exported.

- [ ] **Step 3: Implement the validation contract**

```ts
import { z } from 'zod';

export const inquirySchema = z.object({
  solutionId: z.string().uuid(),
  customerName: z.string().trim().min(1).max(120),
  companyName: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(254),
  application: z.string().trim().max(160).optional(),
  requirementDescription: z.string().trim().min(10).max(4000),
  requiredQuantity: z.coerce.number().int().positive().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
```

- [ ] **Step 4: Re-run validation tests**

Run: `npx vitest run tests/unit/inquiry.test.ts`

Expected: both tests pass.

### Task 3: Implement the database schema, RLS, and demo data

**Files:**
- Create: `supabase/migrations/001_core_schema.sql`
- Create: `supabase/migrations/002_rls_policies.sql`
- Create: `supabase/seed.sql`
- Create: `database/README.md`

**Produces:** Four core tables (`market_demands`, `components`, `motion_solutions`, `customer_inquiries`) and `solution_components` with constraints, indexes, and RLS.

- [ ] **Step 1: Write a failing SQL acceptance query**

```sql
select solution_name
from motion_solutions
where status = 'published';
```

Expected before migration: relation `motion_solutions` does not exist.

- [ ] **Step 2: Create the core schema with explicit relations**

```sql
create extension if not exists pgcrypto;
create type inquiry_status as enum ('new', 'reviewing', 'quoted', 'closed');

create table market_demands (
  id uuid primary key default gen_random_uuid(),
  industry text not null, application text not null, product_name text not null,
  customer_type text, market_region text, customer_problem text,
  motion_requirement text, technical_requirement jsonb not null default '{}'::jsonb,
  market_priority text not null default 'medium' check (market_priority in ('low','medium','high','critical')),
  business_value smallint check (business_value between 1 and 5),
  status text not null default 'draft' check (status in ('draft','validated','archived')),
  created_time timestamptz not null default now(), updated_time timestamptz not null default now()
);

create table components (
  id uuid primary key default gen_random_uuid(), component_type text not null, model text not null,
  specification jsonb not null default '{}'::jsonb, applications text[] not null default '{}',
  is_public boolean not null default false,
  created_time timestamptz not null default now(), updated_time timestamptz not null default now(),
  unique (component_type, model)
);

create table motion_solutions (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references market_demands(id) on delete restrict,
  solution_name text not null, slug text not null unique, application text not null,
  motion_type text not null, solution_description text not null, target_customer text,
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  seo_title text, seo_description text, published_time timestamptz,
  created_time timestamptz not null default now(), updated_time timestamptz not null default now()
);

create table solution_components (
  solution_id uuid not null references motion_solutions(id) on delete cascade,
  component_id uuid not null references components(id) on delete restrict,
  component_role text, quantity numeric(10,2) not null default 1 check (quantity > 0),
  sort_order integer not null default 0, notes text,
  primary key (solution_id, component_id)
);

create table customer_inquiries (
  id uuid primary key default gen_random_uuid(),
  solution_id uuid not null references motion_solutions(id) on delete restrict,
  customer_name text not null, company_name text, country text, email text not null,
  application text, requirement_description text not null,
  required_quantity integer check (required_quantity > 0),
  status inquiry_status not null default 'new', admin_note text,
  created_time timestamptz not null default now(), updated_time timestamptz not null default now()
);
```

- [ ] **Step 3: Add RLS and verify data-access boundaries**

```sql
alter table market_demands enable row level security;
alter table components enable row level security;
alter table motion_solutions enable row level security;
alter table solution_components enable row level security;
alter table customer_inquiries enable row level security;

create policy "published solutions are publicly readable"
on motion_solutions for select to anon using (status = 'published');

create policy "public components are publicly readable"
on components for select to anon using (is_public = true);

create policy "published solution BOM is publicly readable"
on solution_components for select to anon using (
  exists (select 1 from motion_solutions solution
    where solution.id = solution_components.solution_id and solution.status = 'published')
);

create function public.is_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create policy "admins manage demands" on market_demands for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins manage components" on components for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins manage solutions" on motion_solutions for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins manage solution BOM" on solution_components for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins manage inquiries" on customer_inquiries for all to authenticated
using (public.is_admin()) with check (public.is_admin());
```

- [ ] **Step 4: Apply migrations to a configured Supabase project and run acceptance query**

Run: `supabase db push && supabase db reset`

Expected: one `published` demo solution returns and it references at least three components.

### Task 4: Add Supabase server clients and read services

**Files:**
- Create: `src/lib/supabase/server.ts`, `src/services/solutions.ts`, `src/types/database.ts`, `src/middleware.ts`
- Test: `tests/unit/solutions.test.ts`

**Consumes:** tables from Task 3.

**Produces:** `listPublishedSolutions()` and `getPublishedSolutionBySlug(slug)`.

- [ ] **Step 0: Implement request-scoped and server-only Supabase clients**

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export function createRequestClient(context: any) {
  return createServerClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => context.cookies.getAll(),
      setAll: (cookies: { name: string; value: string; options: object }[]) =>
        cookies.forEach(({ name, value, options }) => context.cookies.set(name, value, options)),
    },
  });
}

export function createAdminClient() {
  return createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
```

```ts
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createRequestClient } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = createRequestClient(context);
  if (!context.url.pathname.startsWith('/admin') || context.url.pathname === '/admin/login') return next();
  const { data: { user } } = await context.locals.supabase.auth.getUser();
  return user?.app_metadata?.role === 'admin' ? next() : context.redirect('/admin/login');
});
```

- [ ] **Step 1: Write failing service tests using a Supabase query stub**

```ts
import { expect, it } from 'vitest';
import { mapPublishedSolution } from '../../src/services/solutions';

it('maps a solution with components in display order', () => {
  const result = mapPublishedSolution({ slug: 'smart-lock-actuator', solution_components: [
    { sort_order: 2, components: { model: 'Switch-01' } },
    { sort_order: 1, components: { model: 'Gear-01' } },
  ] });
  expect(result.components.map((component) => component.model)).toEqual(['Gear-01', 'Switch-01']);
});
```

- [ ] **Step 2: Implement the mapping and query service**

```ts
export function mapPublishedSolution(row: any) {
  return {
    ...row,
    components: [...row.solution_components]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((entry) => entry.components),
  };
}

export async function getPublishedSolutionBySlug(client: any, slug: string) {
  const { data, error } = await client
    .from('motion_solutions')
    .select('*, solution_components(sort_order, component_role, quantity, notes, components(*))')
    .eq('slug', slug).eq('status', 'published').single();
  if (error) return null;
  return mapPublishedSolution(data);
}
```

- [ ] **Step 3: Run the service tests**

Run: `npx vitest run tests/unit/solutions.test.ts`

Expected: the component ordering test passes.

### Task 5: Implement public product and Solution pages

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/ContactCta.astro`, `src/components/SolutionCard.astro`
- Create: `src/pages/solutions/index.astro`, `src/pages/solutions/[slug].astro`, `src/pages/components/index.astro`
- Test: `tests/e2e/solutions.spec.ts`

**Consumes:** `getPublishedSolutionBySlug()` and `listPublishedSolutions()`.

**Produces:** public listings and a detail page that only renders published data.

- [ ] **Step 1: Write a failing route test**

```ts
test('published solution page shows its BOM and inquiry CTA', async ({ page }) => {
  await page.goto('/solutions/smart-lock-actuator');
  await expect(page.getByRole('heading', { name: 'Smart Lock Actuator' })).toBeVisible();
  await expect(page.getByText('Gear-01')).toBeVisible();
  await expect(page.getByRole('link', { name: /chinajpq@outlook.com/i })).toBeVisible();
});
```

- [ ] **Step 2: Implement a reusable contact call-to-action**

```astro
---
const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL;
---
<aside aria-label="产品与方案咨询">
  <p>需要产品或 Motion Solution 支持？</p>
  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
</aside>
```

- [ ] **Step 3: Implement the dynamic page with a 404 for non-published slugs**

```astro
---
import ContactCta from '../../components/ContactCta.astro';
import { getPublishedSolutionBySlug } from '../../services/solutions';
const solution = await getPublishedSolutionBySlug(Astro.locals.supabase, Astro.params.slug ?? '');
if (!solution) return Astro.redirect('/solutions');
---
<h1>{solution.solution_name}</h1>
<p>{solution.solution_description}</p>
<ul>{solution.components.map((component) => <li>{component.model}</li>)}</ul>
<ContactCta />
```

- [ ] **Step 4: Run route tests**

Run: `npx playwright test tests/e2e/solutions.spec.ts`

Expected: only the seeded published solution is reachable and its component list is rendered.

### Task 6: Implement the inquiry API and form

**Files:**
- Create: `src/services/inquiries.ts`, `src/pages/api/inquiries.ts`, `src/components/InquiryForm.astro`
- Modify: `src/pages/solutions/[slug].astro`
- Test: `tests/integration/inquiries.test.ts`, `tests/e2e/inquiry-form.spec.ts`

**Consumes:** `InquiryInput`, `inquirySchema`, and published solution service.

**Produces:** `POST /api/inquiries` with validated `new` inquiry creation.

- [ ] **Step 1: Write a failing integration test for unpublished solution rejection**

```ts
it('rejects an inquiry for an unpublished solution', async () => {
  const response = await submitInquiry(fakeClient, {
    solutionId: 'c0a80121-0000-4000-8000-000000000002',
    customerName: 'Ada Lovelace', email: 'ada@example.com',
    requirementDescription: 'Need a compact lock actuator.',
  });
  expect(response).toEqual({ ok: false, code: 'SOLUTION_NOT_FOUND' });
});
```

- [ ] **Step 2: Implement atomic inquiry creation**

```ts
export async function submitInquiry(client: any, input: InquiryInput) {
  const { data: solution } = await client.from('motion_solutions')
    .select('id').eq('id', input.solutionId).eq('status', 'published').maybeSingle();
  if (!solution) return { ok: false as const, code: 'SOLUTION_NOT_FOUND' as const };
  const { error } = await client.from('customer_inquiries').insert({
    solution_id: input.solutionId, customer_name: input.customerName,
    company_name: input.companyName ?? null, country: input.country ?? null,
    email: input.email, application: input.application ?? null,
    requirement_description: input.requirementDescription,
    required_quantity: input.requiredQuantity ?? null, status: 'new',
  });
  return error ? { ok: false as const, code: 'WRITE_FAILED' as const } : { ok: true as const };
}
```

- [ ] **Step 3: Implement the API response contract and form**

```ts
const parsed = inquirySchema.safeParse(await request.json());
if (!parsed.success) return new Response(JSON.stringify({ error: 'INVALID_INPUT' }), { status: 400 });
const result = await submitInquiry(createAdminClient(), parsed.data);
return new Response(JSON.stringify(result), { status: result.ok ? 201 : 404 });
```

- [ ] **Step 4: Run integration and browser tests**

Run: `npx vitest run tests/integration/inquiries.test.ts && npx playwright test tests/e2e/inquiry-form.spec.ts`

Expected: valid data creates a `new` inquiry; invalid or unpublished data is rejected.

### Task 7: Build the administrator workspace

**Files:**
- Create: `src/layouts/AdminLayout.astro`, `src/pages/admin/login.astro`, `src/pages/admin/index.astro`
- Create: `src/pages/admin/demands.astro`, `src/pages/admin/components.astro`, `src/pages/admin/solutions.astro`, `src/pages/admin/inquiries.astro`
- Modify: `src/middleware.ts`
- Test: `tests/e2e/admin-access.spec.ts`

**Consumes:** Supabase Auth and the four business entities.

**Produces:** an administrator-only area for basic CRUD, BOM editing, and inquiry status changes.

- [ ] **Step 1: Write the failing access-control test**

```ts
test('anonymous visitors are redirected away from the admin area', async ({ page }) => {
  await page.goto('/admin/inquiries');
  await expect(page).toHaveURL(/\/admin\/login/);
});
```

- [ ] **Step 2: Implement the middleware guard**

```ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = createRequestClient(context);
  if (!context.url.pathname.startsWith('/admin') || context.url.pathname === '/admin/login') return next();
  const { data: { user } } = await context.locals.supabase.auth.getUser();
  return user?.app_metadata?.role === 'admin' ? next() : context.redirect('/admin/login');
});
```

- [ ] **Step 3: Implement focused admin pages**

```text
/admin/demands     create, edit, validate, archive market demands
/admin/components  create, edit, hide/show components
/admin/solutions   create, edit, assign BOM, review, publish, archive solutions
/admin/inquiries   list inquiries, edit status and admin_note
```

Each mutation must validate request data server-side and rely on the administrator RLS policy. No page includes a supplier field or supplier UI.

- [ ] **Step 4: Run access and CRUD tests**

Run: `npx playwright test tests/e2e/admin-access.spec.ts`

Expected: anonymous users are redirected; an authenticated `admin` test user can load each workspace.

### Task 8: Run end-to-end verification and document setup

**Files:**
- Modify: `README.md`, `database/README.md`
- Test: all tests listed below

**Consumes:** all prior tasks.

**Produces:** reproducible local setup instructions and verified V1 acceptance evidence.

- [ ] **Step 1: Write the end-to-end acceptance scenario**

```text
Given an administrator creates and validates one market demand
And creates three public components
And creates, BOM-links, and publishes one motion solution
When a visitor opens the solution page and submits a valid inquiry
Then one customer_inquiries row exists with status new
And the administrator can update it to reviewing
And no supplier name, supplier contact, or supplier table exists in the application
```

- [ ] **Step 2: Execute the verification commands**

Run: `npm run check && npm run test && npx playwright test && npm run build`

Expected: all commands exit with status 0.

- [ ] **Step 3: Document database bootstrap and admin setup**

```markdown
1. Create a Supabase project and copy its URL, publishable key, and service-role key into `.env`.
2. Apply `supabase/migrations/001_core_schema.sql` then `supabase/migrations/002_rls_policies.sql` with `supabase db push` or the Supabase SQL Editor.
3. Create the first Auth user and set `app_metadata.role` to `admin`.
4. Run `supabase/seed.sql` only in development.
5. Start the app with `npm run dev`.
```

- [ ] **Step 4: Record the final verification output in the task handoff**

Report exact command results and any external setup that remains for the user, without claiming Supabase deployment is complete until credentials and migrations are applied.
