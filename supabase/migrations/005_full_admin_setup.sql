-- ============================================
-- ADMIN USER SETUP
-- Run this ONE TIME in Supabase SQL Editor
-- Creates: auth user (admin@gmail.com / admin1)
--          + admin profile in admins table
-- ============================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin auth user (password: admin1)
-- Uses a fixed UUID so the admin profile can reference it
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
SELECT
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'admin@gmail.com',
  crypt('admin1', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Super Admin"}'::jsonb,
  now(),
  now()
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('admin1', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Create auth identity (required by Supabase)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
)
SELECT
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '{"sub":"a0000000-0000-0000-0000-000000000001","email":"admin@gmail.com","email_verified":true}'::jsonb,
  'email',
  now(),
  now()
ON CONFLICT (id) DO UPDATE SET
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

-- Create admin profile
INSERT INTO public.admins (id, email, full_name, role, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'admin@gmail.com',
  'Super Admin',
  'super_admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = now();

-- Verify
SELECT 'auth_user' as type, id::text, email FROM auth.users WHERE email = 'admin@gmail.com'
UNION ALL
SELECT 'admin_profile' as type, id::text, email FROM public.admins WHERE email = 'admin@gmail.com';
