-- ============================================
-- ADMIN ACCOUNT SEED
-- The Velvet Crumb
-- ============================================
-- Run this AFTER creating the admin user in Supabase Auth
-- 
-- Steps:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user"
-- 3. Enter: admin@gmail.com / admin
-- 4. Copy the User UUID
-- 5. Replace 'YOUR_ADMIN_USER_UUID' below with the actual UUID
-- 6. Run this SQL
-- ============================================

-- Insert admin record (replace UUID with actual user ID from Auth)
INSERT INTO admins (id, email, full_name, role, is_active)
VALUES (
  'YOUR_ADMIN_USER_UUID',  -- Replace with actual UUID from Supabase Auth
  'admin@gmail.com',
  'Super Admin',
  'super_admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ============================================
-- ALTERNATIVE: If you know the admin email exists
-- in auth.users, you can use this trigger approach:
-- ============================================

-- Create a function to auto-create admin record
CREATE OR REPLACE FUNCTION handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'admin@gmail.com' THEN
    INSERT INTO admins (id, email, full_name, role, is_active)
    VALUES (NEW.id, NEW.email, 'Super Admin', 'super_admin', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin();
