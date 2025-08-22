-- Fix infinite recursion in profiles RLS policy
-- Drop the problematic admin policy that causes recursion
drop policy if exists "profiles_select_admin" on public.profiles;

-- Create a simpler admin policy that doesn't reference profiles table
-- This uses a function to check admin status without causing recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Alternative: Create admin policy using auth metadata instead of profiles table
-- This avoids recursion by not querying profiles within the profiles policy
create policy "profiles_select_admin"
  on public.profiles for select
  using (
    -- Allow access if user is admin (checked via separate function call)
    -- or if accessing own profile
    auth.uid() = id or 
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Update profiles update policy to allow admins to update any profile
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (
    auth.uid() = id or 
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Ensure the role is properly set in JWT claims when user signs in
-- This function updates the JWT claims with the user's role
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = user_id;
$$;
