-- Create users table
create table if not exists public.users (
  id uuid not null default auth.uid(),
  email text not null,
  username text not null unique,
  name text not null,
  bio text default '',
  imageUrl text,
  imageId text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id),
  foreign key (id) references auth.users(id) on delete cascade
);

-- Create posts table
create table if not exists public.posts (
  id uuid not null default gen_random_uuid(),
  creator uuid not null,
  caption text not null,
  imageUrl text not null,
  imageName text not null,
  location text default '',
  tags text[] default '{}',
  likes uuid[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id),
  foreign key (creator) references public.users(id) on delete cascade
);

-- Create saves table
create table if not exists public.saves (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  post_id uuid not null,
  created_at timestamp with time zone default now(),
  primary key (id),
  foreign key (user_id) references public.users(id) on delete cascade,
  foreign key (post_id) references public.posts(id) on delete cascade,
  unique(user_id, post_id)
);

-- Create storage bucket for posts
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

-- Set storage policies
create policy "Public Access"
on storage.objects for select
using (bucket_id = 'posts');

create policy "Authenticated users can upload"
on storage.objects for insert
with check (bucket_id = 'posts' and auth.role() = 'authenticated');

create policy "Users can delete own uploads"
on storage.objects for delete
using (bucket_id = 'posts' and auth.role() = 'authenticated');

-- Set RLS policies for users table
alter table public.users enable row level security;

create policy "Users can view all profiles"
on public.users for select
using (true);

create policy "Users can update own profile"
on public.users for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.users for insert
with check (auth.uid() = id);

-- Set RLS policies for posts table
alter table public.posts enable row level security;

create policy "Anyone can view posts"
on public.posts for select
using (true);

create policy "Users can create posts"
on public.posts for insert
with check (auth.uid() = creator);

create policy "Users can update own posts"
on public.posts for update
using (auth.uid() = creator);

create policy "Users can delete own posts"
on public.posts for delete
using (auth.uid() = creator);

-- Set RLS policies for saves table
alter table public.saves enable row level security;

create policy "Users can view own saves"
on public.saves for select
using (auth.uid() = user_id);

create policy "Users can create saves"
on public.saves for insert
with check (auth.uid() = user_id);

create policy "Users can delete own saves"
on public.saves for delete
using (auth.uid() = user_id);

-- Create indexes for better query performance
create index idx_posts_creator on public.posts(creator);
create index idx_posts_created_at on public.posts(created_at);
create index idx_saves_user_id on public.saves(user_id);
create index idx_saves_post_id on public.saves(post_id);
