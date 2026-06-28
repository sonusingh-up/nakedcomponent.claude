-- 1. Add streak_freezes to profiles
alter table public.profiles add column streak_freezes integer default 2 not null;

-- 2. Add consumed_freezes table to track when freezes are used
create table if not exists public.consumed_freezes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  consumed_date date not null,
  created_at timestamp with time zone default now() not null,
  unique(user_id, consumed_date)
);
alter table public.consumed_freezes enable row level security;
create policy consumed_freezes_own on public.consumed_freezes
  for select using (auth.uid() = user_id);

-- 3. Update the trigger
create or replace function public.update_streak()
returns trigger
language plpgsql
as $$
declare
  v_last_date date;
  v_current  integer;
  v_longest  integer;
  v_missed_days integer;
  v_freezes_balance integer;
  v_freeze_consumed boolean;
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

  if new.log_date <= v_last_date then
    return new;
  end if;
  
  if new.log_date = v_last_date + 1 then
    v_current := v_current + 1;
    if v_current > v_longest then v_longest := v_current; end if;
  else
    -- Streak was broken. Check for Streak Freezes.
    v_missed_days := new.log_date - v_last_date - 1;
    v_freeze_consumed := false;
    
    -- Check balance
    select streak_freezes into v_freezes_balance
    from public.profiles
    where id = new.user_id;

    if v_freezes_balance > 0 then
        -- Only protect if they missed exactly 1 day
        if v_missed_days = 1 then
            begin
                insert into public.consumed_freezes (user_id, consumed_date)
                values (new.user_id, v_last_date + 1);
                
                -- Decrement profile
                update public.profiles
                set streak_freezes = streak_freezes - 1
                where id = new.user_id;
                
                v_freeze_consumed := true;
            exception when unique_violation then
                -- Already consumed a freeze for this date by another habit!
                v_freeze_consumed := true;
            end;
        end if;
    end if;

    if v_freeze_consumed then
        -- Streak preserved!
        v_current := v_current + 1; 
        if v_current > v_longest then v_longest := v_current; end if;
    else
        v_current := 1; -- streak broken
    end if;
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
