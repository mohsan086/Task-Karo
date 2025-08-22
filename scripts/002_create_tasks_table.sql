-- Create tasks table with comprehensive task management features
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'completed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date timestamp with time zone,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table public.tasks enable row level security;

-- RLS policies for tasks
-- Users can view tasks assigned to them or created by them
create policy "tasks_select_own"
  on public.tasks for select
  using (
    auth.uid() = assigned_to or 
    auth.uid() = created_by
  );

-- Users can insert tasks (they become the creator)
create policy "tasks_insert_own"
  on public.tasks for insert
  with check (auth.uid() = created_by);

-- Users can update tasks they created or are assigned to
create policy "tasks_update_own"
  on public.tasks for update
  using (
    auth.uid() = assigned_to or 
    auth.uid() = created_by
  );

-- Users can delete tasks they created
create policy "tasks_delete_own"
  on public.tasks for delete
  using (auth.uid() = created_by);

-- Admins can view, update, and delete all tasks
create policy "tasks_admin_all"
  on public.tasks for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.update_updated_at_column();

-- Function to set completed_at when status changes to completed
create or replace function public.handle_task_completion()
returns trigger as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    new.completed_at = timezone('utc'::text, now());
  elsif new.status != 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger to handle task completion
create trigger handle_task_completion_trigger
  before update on public.tasks
  for each row
  execute function public.handle_task_completion();
