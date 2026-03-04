-- Ad Intelligence V3 -- Supabase Schema

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table user_profiles enable row level security;
create policy "Users read own profile" on user_profiles for select using (auth.uid() = id);
create policy "Users update own profile" on user_profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on user_profiles for insert with check (auth.uid() = id);

-- Tracked competitors
create table if not exists competitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  domain text,
  notes text,
  sources jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table competitors enable row level security;
create policy "Users read own competitors" on competitors for select using (auth.uid() = user_id);
create policy "Users write own competitors" on competitors for insert with check (auth.uid() = user_id);
create policy "Users update own competitors" on competitors for update using (auth.uid() = user_id);
create policy "Users delete own competitors" on competitors for delete using (auth.uid() = user_id);

-- Saved briefs
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  competitor_id uuid references competitors(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

alter table briefs enable row level security;
create policy "Users read own briefs" on briefs for select using (auth.uid() = user_id);
create policy "Users write own briefs" on briefs for insert with check (auth.uid() = user_id);
create policy "Users delete own briefs" on briefs for delete using (auth.uid() = user_id);

-- Alert preferences
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  competitor_id uuid references competitors(id) on delete cascade,
  alert_type text not null,
  enabled boolean default true,
  config jsonb default '{}',
  created_at timestamptz default now()
);

alter table alerts enable row level security;
create policy "Users read own alerts" on alerts for select using (auth.uid() = user_id);
create policy "Users write own alerts" on alerts for insert with check (auth.uid() = user_id);
create policy "Users update own alerts" on alerts for update using (auth.uid() = user_id);

-- Analytics events
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table analytics_events enable row level security;
create policy "Insert analytics" on analytics_events for insert with check (true);
