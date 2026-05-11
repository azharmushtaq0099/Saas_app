-- AI Etsy Listing Generator SaaS schema (one-time Stripe unlock)
-- Apply in Supabase SQL editor.

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_pro boolean not null default false,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.webhook_events (
  id bigint generated always as identity primary key,
  stripe_event_id text not null unique,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.listings enable row level security;

-- Users
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users
for select
to authenticated
using (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Listings (user can read/insert own)
drop policy if exists "listings_select_own" on public.listings;
create policy "listings_select_own"
on public.listings
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
on public.listings
for insert
to authenticated
with check (user_id = auth.uid());

-- Utility: ensure public.users row exists after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, is_pro, usage_count)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Server-enforced paywall:
-- Free users: max 3 generations total.
-- Pro users: unlimited.
create or replace function public.consume_generation(limit_free integer default 3)
returns table(allowed boolean, remaining integer, used integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_is_pro boolean;
  v_count integer;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  select is_pro, usage_count
  into v_is_pro, v_count
  from public.users
  where id = v_user
  for update;

  if v_is_pro then
    update public.users
    set usage_count = usage_count + 1, updated_at = now()
    where id = v_user;

    allowed := true;
    used := v_count + 1;
    remaining := 999999999;
    return;
  end if;

  if v_count >= limit_free then
    allowed := false;
    used := v_count;
    remaining := 0;
    return;
  end if;

  update public.users
  set usage_count = usage_count + 1, updated_at = now()
  where id = v_user;

  allowed := true;
  used := v_count + 1;
  remaining := greatest(limit_free - (v_count + 1), 0);
  return;
end;
$$;

revoke all on function public.consume_generation(integer) from public;
grant execute on function public.consume_generation(integer) to authenticated;

