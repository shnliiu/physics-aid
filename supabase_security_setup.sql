-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create User table matching Prisma schema
create table public."User" (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  "fullName" text,
  "avatarUrl" text,
  role text default 'STUDENT' check (role in ('STUDENT', 'TEACHER', 'ADMIN')),
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public."User" enable row level security;

-- Policy: Users can read their own profile
create policy "Users can view own profile" on public."User"
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile" on public."User"
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public."User" (id, email, "fullName", "avatarUrl", "createdAt", "updatedAt")
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    now(), 
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on every new sign up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
