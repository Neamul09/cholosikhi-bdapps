-- Avatar storage setup for py.cholosikhi
--
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- (or `supabase db push` if you've wired up migrations).
--
-- After this, users can upload a profile picture from the Profile page
-- and it will be served from this public bucket.

-- 1. Create the public `avatars` bucket.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

-- 2. Allow anyone (including unauthenticated visitors on a public profile) to read avatars.
drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

-- 3. Allow authenticated users to upload into their own folder only.
--    Path convention is `<user_id>/<timestamp>.<ext>`, so the leading folder
--    must equal the caller's auth.uid().
drop policy if exists "avatars: own folder write" on storage.objects;
create policy "avatars: own folder write"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Allow owners to overwrite/delete their own avatars.
drop policy if exists "avatars: own folder update" on storage.objects;
create policy "avatars: own folder update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars: own folder delete" on storage.objects;
create policy "avatars: own folder delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Optional but recommended: add `avatar_url` column to `profiles` if it
--    doesn't already exist. Safe to re-run.
alter table public.profiles
  add column if not exists avatar_url text;
