-- Create task comments table for collaboration
create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.task_comments enable row level security;

-- RLS policies for task comments
-- Users can view comments on tasks they have access to
create policy "task_comments_select"
  on public.task_comments for select
  using (
    exists (
      select 1 from public.tasks
      where id = task_id and (
        auth.uid() = assigned_to or 
        auth.uid() = created_by
      )
    )
  );

-- Users can insert comments on tasks they have access to
create policy "task_comments_insert"
  on public.task_comments for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.tasks
      where id = task_id and (
        auth.uid() = assigned_to or 
        auth.uid() = created_by
      )
    )
  );

-- Users can update their own comments
create policy "task_comments_update_own"
  on public.task_comments for update
  using (auth.uid() = user_id);

-- Users can delete their own comments
create policy "task_comments_delete_own"
  on public.task_comments for delete
  using (auth.uid() = user_id);

-- Admins can manage all comments
create policy "task_comments_admin_all"
  on public.task_comments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to update updated_at for comments
create trigger update_task_comments_updated_at
  before update on public.task_comments
  for each row
  execute function public.update_updated_at_column();
