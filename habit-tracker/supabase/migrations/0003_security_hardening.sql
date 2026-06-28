-- ============================================================
-- Security hardening — addresses Supabase database-linter warnings
-- ============================================================

-- 1. Pin search_path on the streak trigger function (mutable search_path warn).
create or replace function public.update_streak()
returns trigger
language plpgsql
security invoker
set search_path = public
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
    return new;
  elsif new.log_date = v_last_date + 1 then
    v_current := v_current + 1;
    if v_current > v_longest then v_longest := v_current; end if;
  else
    v_current := 1;
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

-- 2. Trigger functions must never be callable via the REST/RPC API.
revoke execute on function public.update_streak() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 3. adopt_habit (SECURITY DEFINER) — signed-in users only, never anon.
revoke execute on function public.adopt_habit(uuid) from public, anon;
grant execute on function public.adopt_habit(uuid) to authenticated;

-- 4. Scope journal-audio read to the owner so clients can't list everyone's
--    files. Public-URL playback still works (the bucket stays public).
drop policy if exists journal_audio_read on storage.objects;
create policy journal_audio_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'journal-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
