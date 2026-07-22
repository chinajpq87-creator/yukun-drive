create extension if not exists pgcrypto;

create type inquiry_status as enum ('new', 'reviewing', 'quoted', 'closed');

create table market_demands (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  application text not null,
  product_name text not null,
  customer_type text,
  market_region text,
  customer_problem text,
  motion_requirement text,
  technical_requirement jsonb not null default '{}'::jsonb,
  market_priority text not null default 'medium'
    check (market_priority in ('low', 'medium', 'high', 'critical')),
  business_value smallint check (business_value between 1 and 5),
  status text not null default 'draft'
    check (status in ('draft', 'validated', 'archived')),
  created_time timestamptz not null default now(),
  updated_time timestamptz not null default now()
);

create table components (
  id uuid primary key default gen_random_uuid(),
  component_type text not null,
  model text not null,
  specification jsonb not null default '{}'::jsonb,
  applications text[] not null default '{}',
  is_public boolean not null default false,
  created_time timestamptz not null default now(),
  updated_time timestamptz not null default now(),
  unique (component_type, model)
);

create table motion_solutions (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references market_demands(id) on delete restrict,
  solution_name text not null,
  slug text not null unique,
  application text not null,
  motion_type text not null,
  solution_description text not null,
  target_customer text,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  seo_title text,
  seo_description text,
  published_time timestamptz,
  created_time timestamptz not null default now(),
  updated_time timestamptz not null default now()
);

create table solution_components (
  solution_id uuid not null references motion_solutions(id) on delete cascade,
  component_id uuid not null references components(id) on delete restrict,
  component_role text,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  sort_order integer not null default 0,
  notes text,
  primary key (solution_id, component_id)
);

create table customer_inquiries (
  id uuid primary key default gen_random_uuid(),
  solution_id uuid not null references motion_solutions(id) on delete restrict,
  customer_name text not null,
  company_name text,
  country text,
  email text not null,
  application text,
  requirement_description text not null,
  required_quantity integer check (required_quantity > 0),
  status inquiry_status not null default 'new',
  admin_note text,
  created_time timestamptz not null default now(),
  updated_time timestamptz not null default now()
);

create index motion_solutions_public_idx
  on motion_solutions (status, application, priority, published_time desc);

create index customer_inquiries_status_idx
  on customer_inquiries (status, created_time desc);

create or replace function set_updated_time()
returns trigger
language plpgsql
as $$
begin
  new.updated_time = now();
  return new;
end;
$$;

create trigger market_demands_updated_time
before update on market_demands
for each row execute function set_updated_time();

create trigger components_updated_time
before update on components
for each row execute function set_updated_time();

create trigger motion_solutions_updated_time
before update on motion_solutions
for each row execute function set_updated_time();

create trigger customer_inquiries_updated_time
before update on customer_inquiries
for each row execute function set_updated_time();
