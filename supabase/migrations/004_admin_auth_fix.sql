-- Migration: 004_admin_auth_fix
-- Fix admin authentication: SECURITY DEFINER function + INSERT policy
-- The admins table had no INSERT policy and RLS blocked reads without auth
-- This causes checkAdminRole to always fail after login

-- 1. SECURITY DEFINER function to create admin record (bypasses RLS)
CREATE OR REPLACE FUNCTION create_admin_profile(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT DEFAULT 'Admin',
  p_role TEXT DEFAULT 'admin'
)
RETURNS void AS $$
BEGIN
  INSERT INTO admins (id, email, full_name, role, is_active)
  VALUES (p_user_id, p_email, p_full_name, p_role)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Allow authenticated users to insert their own admin profile
-- (auth.uid() = id ensures users can only create their own record)
CREATE POLICY "Authenticated users can create own admin profile"
  ON admins FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Allow authenticated users to read their own admin profile
-- (This already exists but let's make sure it's correct)
-- The existing policy "Admins can view own profile" uses USING (auth.uid() = id)
-- which should work. No change needed.
