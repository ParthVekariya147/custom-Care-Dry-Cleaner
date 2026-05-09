create extension if not exists "pgcrypto";

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text unique,
  phone text,
  segment text default 'standard',
  preferred_locale text default 'en-US',
  created_at timestamptz not null default now()
);

create table if not exists review_invitations (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  customer_id uuid not null references customers(id) on delete cascade,
  service_slug text not null,
  source text default 'qr-campaign',
  locale text default 'en-US',
  sent_at timestamptz default now(),
  created_at timestamptz not null default now()
);

create table if not exists review_generations (
  id uuid primary key default gen_random_uuid(),
  invite_token text,
  customer_id uuid references customers(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  service_slug text not null,
  tone text not null,
  locale text not null default 'en-US',
  keywords jsonb not null default '[]'::jsonb,
  review_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists private_feedback (
  id uuid primary key default gen_random_uuid(),
  invite_token text,
  customer_id uuid references customers(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  service_slug text not null,
  notes text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists lead_captures (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  source text default 'website',
  created_at timestamptz not null default now()
);

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text not null,
  pickup_address text not null,
  service_slug text not null,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists service_orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  total_amount numeric(10, 2) default 0,
  status text default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists pickup_routes (
  id uuid primary key default gen_random_uuid(),
  route_name text not null,
  route_date date not null default current_date,
  stops integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists marketing_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  invite_token text,
  customer_id uuid references customers(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_review_invitations_token on review_invitations(token);
create index if not exists idx_review_generations_customer_id on review_generations(customer_id);
create index if not exists idx_private_feedback_customer_id on private_feedback(customer_id);
create index if not exists idx_marketing_events_event_name on marketing_events(event_name);
