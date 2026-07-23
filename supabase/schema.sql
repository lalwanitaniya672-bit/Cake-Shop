-- ============================================
-- SUPABASE DATABASE SCHEMA
-- The Velvet Crumb - Artisan Cake Boutique
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. FLAVORS
-- ============================================
CREATE TABLE flavors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CAKES
-- ============================================
CREATE TABLE cakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  flavours JSONB DEFAULT '[]',
  serves TEXT,
  prep_time TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  badge TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  dietary JSONB DEFAULT '[]',
  ingredients JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cakes_category ON cakes(category);
CREATE INDEX idx_cakes_slug ON cakes(slug);
CREATE INDEX idx_cakes_is_featured ON cakes(is_featured);
CREATE INDEX idx_cakes_is_active ON cakes(is_active);
CREATE TRIGGER update_cakes_updated_at BEFORE UPDATE ON cakes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. CUSTOMERS
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB DEFAULT '[]',
  total DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2),
  shipping DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 6. CUSTOM ORDERS
-- ============================================
CREATE TABLE custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  cake_type TEXT,
  occasion TEXT,
  event_date TEXT,
  cake_size TEXT,
  quantity TEXT,
  flavour TEXT,
  design_style TEXT,
  special_instructions TEXT,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  payment_method TEXT DEFAULT 'cod',
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_custom_orders_order_status ON custom_orders(order_status);
CREATE INDEX idx_custom_orders_created_at ON custom_orders(created_at DESC);

-- ============================================
-- 7. REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  location TEXT,
  avatar TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  event TEXT,
  cake_name TEXT,
  cake_id TEXT,
  approved BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  helpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_reviews_cake_id ON reviews(cake_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================
-- 8. CONTACT MESSAGES
-- ============================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_read ON contact_messages(read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY - DISABLED (open access)
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (public access)
CREATE POLICY "allow_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_flavors" ON flavors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_cakes" ON cakes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_custom_orders" ON custom_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
