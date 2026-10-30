-- Run this script in Supabase Dashboard > SQL Editor for the INNOV5 GLOBAL HUB project.
create table if not exists public.contact_enquiries (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null default 'General business enquiry' check (char_length(subject) between 1 and 160),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_enquiries enable row level security;

-- No anonymous/authenticated policies are intentionally created. Only the server API,
-- using a server-side Supabase secret key, can insert or read enquiries.
revoke all on table public.contact_enquiries from anon, authenticated;
grant all on table public.contact_enquiries to service_role;

create index if not exists contact_enquiries_created_at_idx
  on public.contact_enquiries (created_at desc);
create index if not exists contact_enquiries_status_idx
  on public.contact_enquiries (status, created_at desc);
