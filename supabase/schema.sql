-- ============================================
-- SUPABASE DATABASE SCHEMA
-- The Velvet Crumb - Artisan Cake Boutique
-- Production-Ready Schema
-- ============================================

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
CREATE TABLE admins (
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
CREATE TABLE customers (
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
CREATE TABLE cakes (
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

CREATE INDEX idx_cakes_category ON cakes(category);
CREATE INDEX idx_cakes_slug ON cakes(slug);
CREATE INDEX idx_cakes_is_featured ON cakes(is_featured);
CREATE INDEX idx_cakes_is_active ON cakes(is_active);

CREATE TRIGGER update_cakes_updated_at BEFORE UPDATE ON cakes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
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

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. CUSTOM ORDERS TABLE
-- ============================================
CREATE TABLE custom_orders (
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

CREATE INDEX idx_custom_orders_customer_id ON custom_orders(customer_id);
CREATE INDEX idx_custom_orders_order_status ON custom_orders(order_status);
CREATE INDEX idx_custom_orders_created_at ON custom_orders(created_at DESC);

CREATE TRIGGER update_custom_orders_updated_at BEFORE UPDATE ON custom_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
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

CREATE INDEX idx_reviews_cake_id ON reviews(cake_id);
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE contact_messages (
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

CREATE INDEX idx_contact_messages_read ON contact_messages(read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ADMINS POLICIES
-- ============================================
CREATE POLICY "Admins can view own profile"
  ON admins FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admins can manage all admins"
  ON admins FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ============================================
-- CUSTOMERS POLICIES
-- ============================================
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can create customer account"
  ON customers FOR INSERT
  WITH CHECK (true);

-- ============================================
-- CAKES POLICIES
-- ============================================
CREATE POLICY "Anyone can view active cakes"
  ON cakes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all cakes"
  ON cakes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can insert cakes"
  ON cakes FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update cakes"
  ON cakes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete cakes"
  ON cakes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

-- ============================================
-- ORDERS POLICIES
-- ============================================
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

-- ============================================
-- CUSTOM ORDERS POLICIES
-- ============================================
CREATE POLICY "Anyone can create custom orders"
  ON custom_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Customers can view own custom orders"
  ON custom_orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all custom orders"
  ON custom_orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update custom orders"
  ON custom_orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete custom orders"
  ON custom_orders FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

-- ============================================
-- REVIEWS POLICIES
-- ============================================
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Customers can view own reviews"
  ON reviews FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

-- ============================================
-- CONTACT MESSAGES POLICIES
-- ============================================
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all messages"
  ON contact_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update messages"
  ON contact_messages FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete messages"
  ON contact_messages FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );

-- ============================================
-- SEED DATA - Sample Cakes
-- ============================================
INSERT INTO cakes (name, slug, description, price, category, flavours, serves, image_url, badge, rating, review_count, is_featured) VALUES
('Rose Petal Dream', 'rose-petal-dream', 'Layers of vanilla sponge with rose-water buttercream and delicate edible petals.', 1850.00, 'Wedding', ARRAY['Vanilla', 'Rose', 'Cardamom'], '40-50', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=800&fit=crop&q=80', 'Bestseller', 4.90, 24, true),
('Dark Chocolate Truffle', 'dark-chocolate-truffle', 'Rich dark chocolate layers with silky ganache and cocoa dusting.', 1450.00, 'Birthday', ARRAY['Dark Chocolate', 'Mocha', 'Hazelnut'], '8-10', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop&q=80', NULL, 4.80, 18, true),
('Berry Cascade', 'berry-cascade', 'Fresh berries cascading down vanilla tiers with lemon curd filling.', 2250.00, 'Wedding', ARRAY['Vanilla', 'Lemon', 'Berry'], '60-80', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop&q=80', 'Sale', 4.90, 15, true),
('Pistachio Opulence', 'pistachio-opulence', 'Premium pistachio sponge with white chocolate ganache.', 1950.00, 'Premium', ARRAY['Pistachio', 'White Chocolate', 'Vanilla'], '10-12', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80', 'Premium', 4.70, 12, false),
('Mirror Glaze Fantasy', 'mirror-glaze-fantasy', 'Mirror-finish glaze with raspberry mousse interior.', 1750.00, 'Custom', ARRAY['Raspberry', 'Vanilla', 'Passion Fruit'], '8-10', 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=800&fit=crop&q=80', NULL, 4.80, 12, false),
('Tropical Paradise', 'tropical-paradise', 'Coconut and passion fruit layers with tropical glaze.', 1650.00, 'Seasonal', ARRAY['Coconut', 'Passion Fruit', 'Mango'], '8-10', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80', 'New', 4.90, 20, true),
('Red Velvet Royale', 'red-velvet-royale', 'Classic red velvet with cream cheese frosting.', 1550.00, 'Classic', ARRAY['Red Velvet', 'Cream Cheese', 'Vanilla'], '10-12', 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&h=800&fit=crop&q=80', NULL, 4.80, 16, false),
('Mango Cheesecake', 'mango-cheesecake', 'Creamy mango cheesecake with graham base and tropical glaze.', 1200.00, 'Seasonal', ARRAY['Mango', 'Vanilla', 'Citrus'], '6-8', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=800&fit=crop&q=80', NULL, 4.60, 10, false),
('Midnight Oreo Crunch', 'midnight-oreo-crunch', 'Oreo cookie layers with vanilla cream and chocolate drizzle.', 1350.00, 'Birthday', ARRAY['Oreo', 'Vanilla', 'Chocolate'], '8-10', 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&h=800&fit=crop&q=80', NULL, 4.70, 14, false),
('Rasmalai Bliss', 'rasmalai-bliss', 'Indian fusion cake with rasmalai flavors and pistachio cream.', 1650.00, 'Premium', ARRAY['Rasmalai', 'Pistachio', 'Cardamom'], '10-12', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=800&fit=crop&q=80', 'Popular', 4.90, 22, true),
('Wedding Elegance', 'wedding-elegance', 'Three-tier white fondant with sugar flowers and gold leaf.', 4500.00, 'Wedding', ARRAY['Vanilla', 'Almond', 'Raspberry'], '100-120', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=800&fit=crop&q=80', 'Premium', 5.00, 8, true),
('Coffee Walnut Delight', 'coffee-walnut-delight', 'Espresso-soaked walnut sponge with coffee buttercream.', 1400.00, 'Classic', ARRAY['Coffee', 'Walnut', 'Caramel'], '8-10', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80', NULL, 4.60, 11, false);

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
