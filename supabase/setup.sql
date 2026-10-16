-- Zinfity website: enquiries + job applications, readable only by the admin.
-- Run this once in Supabase → SQL Editor. Change the admin email below if needed.

-- 1. Tables ---------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 200),
  email text not null check (char_length(email) <= 320),
  company text check (char_length(company) <= 200),
  service text not null check (char_length(service) <= 200),
  budget text not null check (char_length(budget) <= 100),
  message text not null check (char_length(message) <= 10000),
  context text check (char_length(context) <= 1000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (char_length(role) <= 200),
  name text not null check (char_length(name) between 2 and 200),
  email text not null check (char_length(email) <= 320),
  phone text check (char_length(phone) <= 50),
  location text check (char_length(location) <= 200),
  link text check (char_length(link) <= 500),
  message text not null check (char_length(message) <= 10000),
  cv_path text check (char_length(cv_path) <= 300),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

-- Table access for the website's API roles (Row Level Security below still decides what each may do)
grant usage on schema public to anon, authenticated;
grant insert on public.enquiries, public.applications to anon, authenticated;
grant select, update, delete on public.enquiries, public.applications to authenticated;

-- 2. Who is the admin -----------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') in ('infozinfity@gmail.com')
$$;

-- 3. Row Level Security: visitors may only INSERT; only the admin may read/change
alter table public.enquiries enable row level security;
alter table public.applications enable row level security;

drop policy if exists "public can submit" on public.enquiries;
create policy "public can submit" on public.enquiries for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admin reads" on public.enquiries;
create policy "admin reads" on public.enquiries for select to authenticated using (public.is_admin());
drop policy if exists "admin updates" on public.enquiries;
create policy "admin updates" on public.enquiries for update to authenticated using (public.is_admin());
drop policy if exists "admin deletes" on public.enquiries;
create policy "admin deletes" on public.enquiries for delete to authenticated using (public.is_admin());

drop policy if exists "public can submit" on public.applications;
create policy "public can submit" on public.applications for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admin reads" on public.applications;
create policy "admin reads" on public.applications for select to authenticated using (public.is_admin());
drop policy if exists "admin updates" on public.applications;
create policy "admin updates" on public.applications for update to authenticated using (public.is_admin());
drop policy if exists "admin deletes" on public.applications;
create policy "admin deletes" on public.applications for delete to authenticated using (public.is_admin());

-- 4. Private storage for CVs (5 MB, PDF/DOC/DOCX) ------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream'
])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can upload cvs" on storage.objects;
create policy "public can upload cvs" on storage.objects for insert to anon, authenticated with check (bucket_id = 'cvs');
drop policy if exists "admin reads cvs" on storage.objects;
create policy "admin reads cvs" on storage.objects for select to authenticated using (bucket_id = 'cvs' and public.is_admin());
drop policy if exists "admin deletes cvs" on storage.objects;
create policy "admin deletes cvs" on storage.objects for delete to authenticated using (bucket_id = 'cvs' and public.is_admin());
