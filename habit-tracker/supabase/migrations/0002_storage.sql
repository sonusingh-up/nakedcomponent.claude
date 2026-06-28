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
