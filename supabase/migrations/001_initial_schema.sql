-- Migration: 001_initial_schema
-- The Velvet Crumb - Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. CAKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  flavours TEXT[] DEFAULT '{}',
  serves TEXT,
  image_url TEXT,
  badge TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cakes_category ON cakes(category);
CREATE INDEX IF NOT EXISTS idx_cakes_slug ON cakes(slug);
CREATE INDEX IF NOT EXISTS idx_cakes_is_featured ON cakes(is_featured);
CREATE INDEX IF NOT EXISTS idx_cakes_is_active ON cakes(is_active);

CREATE TRIGGER update_cakes_updated_at BEFORE UPDATE ON cakes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'online')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. CUSTOM ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  cake_type TEXT NOT NULL,
  occasion TEXT,
  event_date DATE,
  cake_size TEXT NOT NULL,
  flavour TEXT NOT NULL,
  design_style TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  special_instructions TEXT,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  payment_method TEXT DEFAULT 'cod',
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'designing', 'preparing', 'ready', 'delivered', 'cancelled')),
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_orders_customer_id ON custom_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_custom_orders_order_status ON custom_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_custom_orders_created_at ON custom_orders(created_at DESC);

CREATE TRIGGER update_custom_orders_updated_at BEFORE UPDATE ON custom_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  cake_id UUID REFERENCES cakes(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_cake_id ON reviews(cake_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ADMINS
CREATE POLICY "Admins can view own profile" ON admins FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admins can manage all admins" ON admins FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid() AND role = 'super_admin'));

-- CUSTOMERS
CREATE POLICY "Customers can view own profile" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Customers can update own profile" ON customers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can create customer account" ON customers FOR INSERT WITH CHECK (true);

-- CAKES
CREATE POLICY "Anyone can view active cakes" ON cakes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all cakes" ON cakes FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can insert cakes" ON cakes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can update cakes" ON cakes FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can delete cakes" ON cakes FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- ORDERS
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- CUSTOM ORDERS
CREATE POLICY "Anyone can create custom orders" ON custom_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can view own custom orders" ON custom_orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Admins can view all custom orders" ON custom_orders FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can update custom orders" ON custom_orders FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can delete custom orders" ON custom_orders FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- REVIEWS
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can view own reviews" ON reviews FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Admins can view all reviews" ON reviews FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can update reviews" ON reviews FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- CONTACT MESSAGES
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all messages" ON contact_messages FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can update messages" ON contact_messages FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY "Admins can delete messages" ON contact_messages FOR DELETE USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
