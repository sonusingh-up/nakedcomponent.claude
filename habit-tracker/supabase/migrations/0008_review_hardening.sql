-- ============================================================
-- 0008 — Code-review hardening
--   1. Re-pin search_path on streak functions (0006/0007 regression)
--   2. adopt_habit: visibility check + count social proof once
--   3. reminders: dedupe + unique per habit (form races created dupes)
--   4. journal_images: folder-scoped storage policies (match audio)
--   5. Freeze economy moves server-side (atomic, race-free RPCs)
--   6. Unique catalog-name index so seed.sql can upsert idempotently
-- ============================================================

-- ------------------------------------------------------------
-- 1. Streak functions: pin search_path again, scope execute.
--    (Bodies unchanged from 0007.)
-- ------------------------------------------------------------
create or replace function public.recalculate_streak(p_user_habit_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
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
      v_last_date := v_rec.log_date;
    else
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
security invoker
set search_path = public
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

-- Trigger functions are never callable over RPC. recalculate_streak must
-- stay executable by authenticated because the invoker-rights trigger
-- calls it as the logging user (RLS makes it harmless to call directly).
revoke execute on function public.update_streak() from public, anon, authenticated;
revoke execute on function public.recalculate_streak(uuid) from public, anon;
grant  execute on function public.recalculate_streak(uuid) to authenticated;

-- ------------------------------------------------------------
-- 2. adopt_habit: reject invisible habits (someone else's custom
--    habit by UUID) and only bump social proof on first adoption.
-- ------------------------------------------------------------
create or replace function public.adopt_habit(p_habit_id uuid)
returns public.user_habits
language plpgsql
security definer set search_path = public
as $$
declare
  v_row public.user_habits;
  v_existed boolean;
begin
  if not exists (
    select 1 from public.habits h
    where h.id = p_habit_id
      and h.is_active
      and (h.owner_id is null or h.owner_id = auth.uid())
  ) then
    raise exception 'habit not found';
  end if;

  select exists (
    select 1 from public.user_habits
    where user_id = auth.uid() and habit_id = p_habit_id
  ) into v_existed;

  insert into public.user_habits (user_id, habit_id)
  values (auth.uid(), p_habit_id)
  on conflict (user_id, habit_id) do update set is_active = true
  returning * into v_row;

  if not v_existed then
    update public.habits
       set social_proof_count = social_proof_count + 1
     where id = p_habit_id;
  end if;

  return v_row;
end;
$$;

-- ------------------------------------------------------------
-- 3. Reminders: one per habit. Keep the newest duplicate.
-- ------------------------------------------------------------
delete from public.reminders a
using public.reminders b
where a.user_habit_id = b.user_habit_id
  and (a.created_at < b.created_at
       or (a.created_at = b.created_at and a.id < b.id));

create unique index if not exists uq_reminders_user_habit
  on public.reminders (user_habit_id);

-- ------------------------------------------------------------
-- 4. journal_images: folder-scoped policies like journal-audio
--    (the previous owner-based check let any signed-in user write
--    into any folder, and read was fully public).
-- ------------------------------------------------------------
drop policy if exists "Users can upload their own journal images" on storage.objects;
drop policy if exists "Users can update their own journal images" on storage.objects;
drop policy if exists "Users can delete their own journal images" on storage.objects;
drop policy if exists "Anyone can view journal images" on storage.objects;

create policy journal_images_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'journal_images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy journal_images_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'journal_images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy journal_images_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'journal_images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ------------------------------------------------------------
-- 5. Freeze economy — server-side, atomic.
--    Clients may only read their bank; spending goes through RPCs.
-- ------------------------------------------------------------
drop policy if exists freeze_banks_own on public.freeze_banks;
create policy freeze_banks_read on public.freeze_banks
  for select using (user_id = auth.uid());

create or replace function public.get_or_create_freeze_bank()
returns public.freeze_banks
language plpgsql
security definer set search_path = public
as $$
declare
  v_month date := date_trunc('month', current_date)::date;
  v_row public.freeze_banks;
begin
  insert into public.freeze_banks (user_id, month_start)
  values (auth.uid(), v_month)
  on conflict (user_id, month_start) do nothing;

  select * into v_row
    from public.freeze_banks
   where user_id = auth.uid() and month_start = v_month;
  return v_row;
end;
$$;

create or replace function public.use_freeze(p_user_habit_id uuid, p_date date)
returns public.freeze_banks
language plpgsql
security definer set search_path = public
as $$
declare
  v_bank public.freeze_banks;
  v_available integer;
begin
  if not exists (
    select 1 from public.user_habits
    where id = p_user_habit_id and user_id = auth.uid()
  ) then
    raise exception 'habit not found';
  end if;

  if p_date > current_date then
    raise exception 'cannot freeze a future date';
  end if;

  if exists (
    select 1 from public.habit_logs
    where user_habit_id = p_user_habit_id
      and log_date = p_date
      and status = 'completed'
  ) then
    raise exception 'already completed on that date';
  end if;

  v_bank := public.get_or_create_freeze_bank();

  -- Serialise concurrent spends on the same bank.
  select * into v_bank from public.freeze_banks
   where id = v_bank.id
   for update;

  v_available := (2 - v_bank.base_used)
               + case when v_bank.bonus_earned and not v_bank.bonus_used then 1 else 0 end;
  if v_available <= 0 then
    raise exception 'no freezes available';
  end if;

  if v_bank.base_used < 2 then
    update public.freeze_banks
       set base_used = base_used + 1, updated_at = now()
     where id = v_bank.id
     returning * into v_bank;
  else
    update public.freeze_banks
       set bonus_used = true, updated_at = now()
     where id = v_bank.id
     returning * into v_bank;
  end if;

  insert into public.habit_logs (user_id, user_habit_id, log_date, count, status)
  values (auth.uid(), p_user_habit_id, p_date, 1, 'frozen')
  on conflict (user_habit_id, log_date)
    do update set status = 'frozen';

  return v_bank;
end;
$$;

create or replace function public.award_bonus_freeze()
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_bank public.freeze_banks;
begin
  v_bank := public.get_or_create_freeze_bank();

  update public.freeze_banks
     set bonus_earned = true, updated_at = now()
   where id = v_bank.id and bonus_earned = false;
  return found;
end;
$$;

revoke execute on function public.get_or_create_freeze_bank() from public, anon;
revoke execute on function public.use_freeze(uuid, date) from public, anon;
revoke execute on function public.award_bonus_freeze() from public, anon;
grant  execute on function public.get_or_create_freeze_bank() to authenticated;
grant  execute on function public.use_freeze(uuid, date) to authenticated;
grant  execute on function public.award_bonus_freeze() to authenticated;

-- ------------------------------------------------------------
-- 6. Catalog names are unique (custom habits excluded) so the seed
--    can upsert instead of delete-and-reinsert.
-- ------------------------------------------------------------
create unique index if not exists uq_habits_catalog_name
  on public.habits (name)
  where owner_id is null;
