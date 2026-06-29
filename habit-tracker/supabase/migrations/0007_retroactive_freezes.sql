-- 1. Remove old automatic streak freezes implementation
alter table public.profiles drop column if exists streak_freezes;
drop table if exists public.consumed_freezes;

-- 2. Add status to habit_logs
alter table public.habit_logs
  add column status text not null default 'completed'
  check (status in ('completed', 'missed', 'frozen'));

-- 3. Create freeze_banks table
create table if not exists public.freeze_banks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month_start date not null,
  base_used integer not null default 0,
  bonus_earned boolean not null default false,
  bonus_used boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, month_start)
);
alter table public.freeze_banks enable row level security;
create policy freeze_banks_own on public.freeze_banks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 4. Robust Streak Recalculation (handles retroactive changes safely)
create or replace function public.recalculate_streak(p_user_habit_id uuid)
returns void
language plpgsql
as $$
declare
  v_rec record;
  v_current integer := 0;
  v_longest integer := 0;
  v_last_date date := null;
begin
  for v_rec in (
    select log_date, status
    from public.habit_logs
    where user_habit_id = p_user_habit_id
    order by log_date asc
  ) loop
    if v_rec.status = 'missed' then
      v_current := 0;
      v_last_date := v_rec.log_date;
    elsif v_rec.status = 'frozen' then
      -- streak maintained, just advance date
      v_last_date := v_rec.log_date;
    else
      -- completed
      if v_last_date is null or v_rec.log_date = v_last_date + 1 then
        v_current := v_current + 1;
      else
        v_current := 1;
      end if;
      if v_current > v_longest then v_longest := v_current; end if;
      v_last_date := v_rec.log_date;
    end if;
  end loop;

  update public.habit_streaks
  set current_streak = v_current,
      longest_streak = v_longest,
      last_logged_date = v_last_date,
      updated_at = now()
  where user_habit_id = p_user_habit_id;
  
  if not found and v_last_date is not null then
    insert into public.habit_streaks (user_habit_id, current_streak, longest_streak, last_logged_date)
    values (p_user_habit_id, v_current, v_longest, v_last_date);
  end if;
end;
$$;

create or replace function public.update_streak()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'DELETE' then
    perform public.recalculate_streak(old.user_habit_id);
    return old;
  else
    perform public.recalculate_streak(new.user_habit_id);
    return new;
  end if;
end;
$$;

drop trigger if exists trg_update_streak on public.habit_logs;
create trigger trg_update_streak
  after insert or update or delete on public.habit_logs
  for each row execute function public.update_streak();
