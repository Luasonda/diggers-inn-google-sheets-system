-- Diggers Bar & Restaurant stock-control schema (PostgreSQL / Supabase friendly)

create extension if not exists pgcrypto;

create type user_role as enum ('admin', 'manager', 'storekeeper', 'bartender');
create type stock_type as enum ('full_bottle', 'liquor_weighted', 'simple_unit');
create type session_status as enum ('draft', 'open', 'submitted', 'locked');
create type audit_action as enum ('create', 'update', 'delete', 'lock', 'unlock', 'approve');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role user_role not null,
  password_hash text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  unit text not null,
  stock_type stock_type not null,
  cost_price numeric(12,2) not null default 0,
  sell_price numeric(12,2) not null default 0,
  reorder_level numeric(12,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, unit)
);

create table if not exists liquor_profiles (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references products(id) on delete cascade,
  bottle_ml numeric(10,2) not null check (bottle_ml > 0),
  shot_ml numeric(10,2) not null check (shot_ml > 0),
  full_bottle_weight_g numeric(10,2) not null check (full_bottle_weight_g > 0),
  empty_bottle_weight_g numeric(10,2) not null check (empty_bottle_weight_g >= 0),
  tolerance_shots numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (full_bottle_weight_g > empty_bottle_weight_g)
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists stock_sessions (
  id uuid primary key default gen_random_uuid(),
  business_date date not null,
  location_id uuid not null references locations(id),
  status session_status not null default 'draft',
  opened_by_user_id uuid not null references users(id),
  closed_by_user_id uuid references users(id),
  locked_by_user_id uuid references users(id),
  locked_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_date, location_id)
);

create table if not exists stock_issues (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references stock_sessions(id) on delete set null,
  issue_date timestamptz not null default now(),
  product_id uuid not null references products(id),
  quantity numeric(12,2) not null check (quantity >= 0),
  issued_by_user_id uuid not null references users(id),
  received_by_user_id uuid not null references users(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_date timestamptz not null default now(),
  product_id uuid not null references products(id),
  supplier_name text,
  quantity numeric(12,2) not null check (quantity >= 0),
  unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0),
  recorded_by_user_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists stock_session_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references stock_sessions(id) on delete cascade,
  product_id uuid not null references products(id),
  opening_full_bottles numeric(12,2) default 0 check (opening_full_bottles >= 0),
  opening_gross_weight_g numeric(12,2) default 0 check (opening_gross_weight_g >= 0),
  opening_computed_shots numeric(12,2) default 0,
  issued_qty numeric(12,2) not null default 0 check (issued_qty >= 0),
  closing_full_bottles numeric(12,2) default 0 check (closing_full_bottles >= 0),
  closing_gross_weight_g numeric(12,2) default 0 check (closing_gross_weight_g >= 0),
  closing_computed_shots numeric(12,2) default 0,
  expected_closing_qty numeric(12,2) default 0,
  actual_closing_qty numeric(12,2) default 0,
  variance_qty numeric(12,2) default 0,
  variance_value numeric(12,2) default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(session_id, product_id)
);

create table if not exists stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  stock_session_item_id uuid references stock_session_items(id) on delete set null,
  quantity_delta numeric(12,2) not null,
  reason text not null,
  approved_by_user_id uuid references users(id),
  created_by_user_id uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action audit_action not null,
  entity_type text not null,
  entity_id uuid,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_stock_sessions_date on stock_sessions(business_date);
create index if not exists idx_stock_issues_product_date on stock_issues(product_id, issue_date);
create index if not exists idx_session_items_session on stock_session_items(session_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);

-- Notes:
-- 1. Bartenders should not get write access to products, users, or adjustments.
-- 2. Compute liquor shot conversions in app/service logic using liquor_profiles.
-- 3. Lock sessions after supervisor review to prevent historical edits.
