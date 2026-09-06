-- ============================================================
-- Habit Tracker — Supabase Migration Script
-- Run this in the Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

-- 1. Create habits table
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  frequency text default 'daily',
  target_days_per_week int default 7,
  color text default '#4F46E5',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Create habit_logs table (records completions)
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_date date not null default current_date,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique(habit_id, completed_date)
);

-- 3. Enable Row Level Security (RLS)
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- 4. RLS Policies for habits
create policy "Users can view their own habits" on public.habits
  for select using (auth.uid() = user_id);

create policy "Users can create their own habits" on public.habits
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own habits" on public.habits
  for update using (auth.uid() = user_id);

create policy "Users can delete their own habits" on public.habits
  for delete using (auth.uid() = user_id);

-- 5. RLS Policies for habit_logs
create policy "Users can view their own habit logs" on public.habit_logs
  for select using (auth.uid() = user_id);

create policy "Users can toggle/insert their own habit logs" on public.habit_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can remove their own habit logs" on public.habit_logs
  for delete using (auth.uid() = user_id);
