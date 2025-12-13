-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Core Auth)
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  username text unique not null,
  email text unique not null,
  password text not null, -- Storing hashed password here for custom auth
  role text check (role in ('public', 'admin')) default 'public',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles Table (Extended Info)
create table public.profiles (
  id uuid references public.users(id) on delete cascade primary key,
  full_name text,
  bio text,
  avatar_url text,
  timezone text default 'UTC',
  study_interests text[], -- Array of strings
  updated_at timestamp with time zone
);

-- 3. Goals Table
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  target_hours numeric not null,
  deadline timestamp with time zone,
  status text check (status in ('active', 'completed', 'abandoned')) default 'active',
  category text, -- e.g., 'Academic', 'Skill', 'Language'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Study Sessions Table
create table public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete set null,
  duration integer not null, -- in minutes
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  notes text,
  mood_rating integer check (mood_rating between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Partner Requests Table
create table public.partner_requests (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(sender_id, receiver_id)
);

-- 6. Partnerships Table (Active Connections)
create table public.partnerships (
  id uuid default uuid_generate_v4() primary key,
  user1_id uuid references public.users(id) on delete cascade not null,
  user2_id uuid references public.users(id) on delete cascade not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user1_id, user2_id)
);

-- 7. Achievements Table (System Definitions)
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null, -- e.g., 'STREAK_7'
  title text not null,
  description text not null,
  icon_url text,
  criteria jsonb -- e.g., { "type": "streak", "value": 7 }
);

-- 8. User Achievements Table (Earned Badges)
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- 9. Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null, -- 'request', 'achievement', 'system'
  title text not null,
  message text,
  read boolean default false,
  data jsonb, -- Extra data like request_id
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_goals_user on public.goals(user_id);
create index idx_sessions_user on public.study_sessions(user_id);
create index idx_sessions_start on public.study_sessions(start_time);
create index idx_notifications_user on public.notifications(user_id);

-- 10. Admin Audit Logs
create table public.admin_audit_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.users(id) on delete set null,
  action text not null, -- e.g., 'delete_user', 'update_setting'
  target_resource text, -- e.g., 'user_123'
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. System Settings
create table public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references public.users(id)
);

-- 12. Support Tickets
create table public.support_tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  subject text not null,
  message text not null,
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

create index idx_tickets_user on public.support_tickets(user_id);
create index idx_tickets_status on public.support_tickets(status);
