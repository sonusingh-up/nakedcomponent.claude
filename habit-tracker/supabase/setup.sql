-- ==================================================================
-- Habit Tracker — one-shot database setup
-- Paste this entire file into the Supabase SQL editor and run it.
-- Equivalent to migrations/0001_init.sql + 0002_storage.sql + seed.sql
-- ==================================================================

-- ============================================================
-- Habit Tracker — initial schema
-- Auth-based (Supabase Auth). Every user-scoped table is isolated
-- via RLS using auth.uid().
-- ============================================================

-- ------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  timezone     text default 'Asia/Kolkata',
  created_at   timestamptz default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- habits (public read-only catalog)
-- ------------------------------------------------------------
create table if not exists public.habits (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  description        text,
  category           text not null,
  icon               text not null,
  color              text default '#c96442',
  social_proof_count integer default 0,
  frequency_type     text default 'daily',
  sort_order         integer default 0,
  is_active          boolean default true,
  created_at         timestamptz default now()
);
create index if not exists idx_habits_category on public.habits (category);

-- ------------------------------------------------------------
-- user_habits (habits a user has adopted)
-- ------------------------------------------------------------
create table if not exists public.user_habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  habit_id     uuid not null references public.habits (id) on delete cascade,
  adopted_at   timestamptz default now(),
  is_active    boolean default true,
  custom_name  text,
  target_count integer default 1,
  target_unit  text default 'times',
  sort_order   integer default 0,
  unique (user_id, habit_id)
);
create index if not exists idx_user_habits_user on public.user_habits (user_id);

-- ------------------------------------------------------------
-- habit_logs (daily check-ins)
-- ------------------------------------------------------------
create table if not exists public.habit_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  user_habit_id uuid not null references public.user_habits (id) on delete cascade,
  log_date      date not null default current_date,
  count         integer default 1,
  notes         text,
  mood          text,
  logged_at     timestamptz default now(),
  unique (user_habit_id, log_date)
);
create index if not exists idx_habit_logs_user_date on public.habit_logs (user_id, log_date);

-- ------------------------------------------------------------
-- habit_streaks (cached, maintained by trigger)
-- ------------------------------------------------------------
create table if not exists public.habit_streaks (
  id               uuid primary key default gen_random_uuid(),
  user_habit_id    uuid not null references public.user_habits (id) on delete cascade unique,
  current_streak   integer default 0,
  longest_streak   integer default 0,
  last_logged_date date,
  updated_at       timestamptz default now()
);

-- ------------------------------------------------------------
-- reminders
-- ------------------------------------------------------------
create table if not exists public.reminders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  user_habit_id uuid not null references public.user_habits (id) on delete cascade,
  remind_time   time not null,
  remind_days   text[] default '{mon,tue,wed,thu,fri,sat,sun}',
  is_enabled    boolean default true,
  created_at    timestamptz default now()
);
create index if not exists idx_reminders_user on public.reminders (user_id);

-- ------------------------------------------------------------
-- journal_entries
-- ------------------------------------------------------------
create table if not exists public.journal_entries (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  user_habit_id  uuid references public.user_habits (id) on delete set null,
  entry_type     text not null default 'text',
  title          text,
  body           text,
  audio_url      text,
  audio_duration integer,
  tags           text[],
  mood           text,
  created_at     timestamptz default now()
);
create index if not exists idx_journal_user_created on public.journal_entries (user_id, created_at desc);

-- ============================================================
-- Streak maintenance trigger
-- ============================================================
create or replace function public.update_streak()
returns trigger
language plpgsql
as $$
declare
  v_last_date date;
  v_current  integer;
  v_longest  integer;
begin
  select last_logged_date, current_streak, longest_streak
    into v_last_date, v_current, v_longest
    from public.habit_streaks
   where user_habit_id = new.user_habit_id;

  if not found then
    insert into public.habit_streaks (user_habit_id, current_streak, longest_streak, last_logged_date)
    values (new.user_habit_id, 1, 1, new.log_date);
    return new;
  end if;

  if new.log_date = v_last_date then
    return new;                                   -- already logged today
  elsif new.log_date = v_last_date + 1 then
    v_current := v_current + 1;                   -- consecutive day
    if v_current > v_longest then v_longest := v_current; end if;
  else
    v_current := 1;                               -- streak broken / first in a while
  end if;

  update public.habit_streaks
     set current_streak = v_current,
         longest_streak = v_longest,
         last_logged_date = new.log_date,
         updated_at = now()
   where user_habit_id = new.user_habit_id;

  return new;
end;
$$;

drop trigger if exists trg_update_streak on public.habit_logs;
create trigger trg_update_streak
  after insert on public.habit_logs
  for each row execute function public.update_streak();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.habits          enable row level security;
alter table public.user_habits     enable row level security;
alter table public.habit_logs      enable row level security;
alter table public.habit_streaks   enable row level security;
alter table public.reminders       enable row level security;
alter table public.journal_entries enable row level security;

-- Habits catalog: anyone (even anon) may read.
drop policy if exists habits_public_read on public.habits;
create policy habits_public_read on public.habits
  for select using (true);

-- profiles: a user manages only their own row.
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- user-scoped tables keyed directly by user_id.
drop policy if exists user_habits_own on public.user_habits;
create policy user_habits_own on public.user_habits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists habit_logs_own on public.habit_logs;
create policy habit_logs_own on public.habit_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists reminders_own on public.reminders;
create policy reminders_own on public.reminders
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists journal_own on public.journal_entries;
create policy journal_own on public.journal_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- streaks are keyed by user_habit_id; check ownership via the parent row.
drop policy if exists streaks_own on public.habit_streaks;
create policy streaks_own on public.habit_streaks
  for all using (
    exists (
      select 1 from public.user_habits uh
      where uh.id = habit_streaks.user_habit_id and uh.user_id = auth.uid()
    )
  );

-- ============================================================
-- Atomic "adopt a habit" helper that also bumps social proof.
-- ============================================================
create or replace function public.adopt_habit(p_habit_id uuid)
returns public.user_habits
language plpgsql
security definer set search_path = public
as $$
declare
  v_row public.user_habits;
begin
  insert into public.user_habits (user_id, habit_id)
  values (auth.uid(), p_habit_id)
  on conflict (user_id, habit_id) do update set is_active = true
  returning * into v_row;

  update public.habits
     set social_proof_count = social_proof_count + 1
   where id = p_habit_id;

  return v_row;
end;
$$;


-- ============================================================
-- Storage bucket for journal audio notes
-- ============================================================
insert into storage.buckets (id, name, public)
values ('journal-audio', 'journal-audio', true)
on conflict (id) do nothing;

-- Public read (files are served via public URLs).
drop policy if exists journal_audio_read on storage.objects;
create policy journal_audio_read on storage.objects
  for select using (bucket_id = 'journal-audio');

-- Authenticated users may upload only into their own user-id folder.
drop policy if exists journal_audio_insert on storage.objects;
create policy journal_audio_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'journal-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ...and delete only their own files.
drop policy if exists journal_audio_delete on storage.objects;
create policy journal_audio_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'journal-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ---------- seed catalog ----------
-- Seed catalog of habits. Safe to re-run: clears and reinserts the catalog.
-- social_proof_count values are illustrative starting numbers.

delete from public.habits;

insert into public.habits (name, description, category, icon, color, social_proof_count, sort_order) values
  -- Hydration
  ('Drink more water',        'Sip your way to 8 glasses a day. Better focus, better skin, better you.', 'hydration',   'i-lucide-glass-water', '#5b8bb0', 1312, 1),
  ('Morning glass of water',  'Kick-start your metabolism with water before coffee.',                    'hydration',   'i-lucide-droplet',     '#5b8bb0', 842,  2),
  -- Fitness
  ('Move for 30 minutes',     'A walk, a run, a workout — just move your body daily.',                   'fitness',     'i-lucide-footprints',  '#c96442', 2104, 3),
  ('10,000 steps',            'Hit your step goal and feel the difference by evening.',                  'fitness',     'i-lucide-activity',    '#c96442', 1789, 4),
  ('Stretch & mobility',      'Five minutes of stretching to undo the desk damage.',                     'fitness',     'i-lucide-stretch-horizontal', '#c96442', 654, 5),
  ('Strength training',       'Build muscle and bone density with resistance work.',                     'fitness',     'i-lucide-dumbbell',    '#c96442', 1203, 6),
  -- Nutrition
  ('Eat more greens',         'Add a serving of vegetables to every main meal.',                         'nutrition',   'i-lucide-salad',       '#5a8a4a', 977,  7),
  ('No sugar after 6pm',      'Cut the evening sugar to sleep deeper and wake clearer.',                 'nutrition',   'i-lucide-candy-off',   '#5a8a4a', 588,  8),
  ('Take creatine',           '5g daily — the most researched supplement there is.',                     'nutrition',   'i-lucide-pill',        '#5a8a4a', 1450, 9),
  ('Protein with breakfast',  'Front-load protein to stay full and steady all morning.',                 'nutrition',   'i-lucide-egg',         '#5a8a4a', 712,  10),
  -- Mindfulness
  ('Meditate',                'Ten quiet minutes to reset your nervous system.',                         'mindfulness', 'i-lucide-brain',       '#4a6b8a', 1620, 11),
  ('Gratitude journaling',    'Write down three things you are grateful for.',                           'mindfulness', 'i-lucide-heart',       '#4a6b8a', 893,  12),
  ('Digital sunset',          'No screens 60 minutes before bed.',                                       'mindfulness', 'i-lucide-smartphone',  '#4a6b8a', 467,  13),
  ('Breathwork',              'Two minutes of box breathing to calm down fast.',                         'mindfulness', 'i-lucide-wind',        '#4a6b8a', 538,  14),
  -- Sleep
  ('Sleep by 11pm',           'Protect your circadian rhythm with a consistent bedtime.',                'sleep',       'i-lucide-moon',        '#3f5b7a', 1045, 15),
  ('7+ hours of sleep',       'Give your body the recovery time it actually needs.',                     'sleep',       'i-lucide-bed',         '#3f5b7a', 1330, 16),
  ('No caffeine after 2pm',   'Let the afternoon cup go for deeper sleep tonight.',                      'sleep',       'i-lucide-coffee',      '#3f5b7a', 621,  17),
  -- Productivity
  ('Plan tomorrow tonight',   'Three priorities written before you close the laptop.',                   'productivity','i-lucide-list-todo',   '#b08a2e', 734,  18),
  ('Deep work block',         'One distraction-free hour on what matters most.',                         'productivity','i-lucide-target',      '#b08a2e', 856,  19),
  ('Read 10 pages',           'A book a month, ten pages at a time.',                                    'productivity','i-lucide-book-open',   '#b08a2e', 1198, 20),
  ('Inbox to zero',           'Clear and triage your inbox once a day.',                                 'productivity','i-lucide-inbox',       '#b08a2e', 402,  21),
  ('Tidy for 5 minutes',      'A quick daily reset keeps the space (and mind) clear.',                   'productivity','i-lucide-sparkles',    '#b08a2e', 389,  22);
