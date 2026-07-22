alter table market_demands enable row level security;
alter table components enable row level security;
alter table motion_solutions enable row level security;
alter table solution_components enable row level security;
alter table customer_inquiries enable row level security;

create function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create policy "published solutions are publicly readable"
on motion_solutions for select to anon
using (status = 'published');

create policy "public components are publicly readable"
on components for select to anon
using (is_public = true);

create policy "published solution BOM is publicly readable"
on solution_components for select to anon
using (
  exists (
    select 1 from motion_solutions
    where motion_solutions.id = solution_components.solution_id
      and motion_solutions.status = 'published'
  )
);

create policy "admins manage market demands"
on market_demands for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "admins manage components"
on components for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "admins manage motion solutions"
on motion_solutions for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "admins manage solution components"
on solution_components for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "admins manage customer inquiries"
on customer_inquiries for all to authenticated
using (public.is_admin()) with check (public.is_admin());
