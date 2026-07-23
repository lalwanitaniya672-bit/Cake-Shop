-- Migration: 002_seed_data
-- The Velvet Crumb - Sample Cake Data
-- Run this AFTER 001_initial_schema.sql

-- Sample Cakes
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

-- Sample Reviews
INSERT INTO reviews (customer_name, location, rating, comment, approved) VALUES
('Priya & Rahul Deshpande', 'Pune', 5, 'Ordered a 3-tier wedding cake and it was absolutely stunning! The rose petal design was exactly what we envisioned. Guests are still talking about it.', true),
('Ananya Desai', 'Ahmedabad', 5, 'The Dark Chocolate Truffle cake was the highlight of my daughter''s birthday. Rich, decadent, and beautifully decorated. Will order again!', true),
('Meera Iyer', 'Bengaluru', 5, 'Flavors are incredible. The attention to detail in every layer shows the passion behind their craft. Best bakery in the city.', true),
('Arjun Nair', 'Kochi', 5, 'I''ve tried cakes from many bakeries, but nothing compares to the quality and taste here. The Mirror Glaze Fantasy was a work of art.', true),
('Deepa Menon', 'Hyderabad', 4, 'Beautiful cakes with premium ingredients. The Pistachio Opulence was a unique and delicious choice for our anniversary.', true),
('Vikram Patel', 'Mumbai', 5, 'From order to delivery, everything was perfect. The Berry Cascade cake was fresh, flavorful, and exactly as pictured.', true),
('Neha Sharma', 'Delhi', 5, 'The Red Velvet Royale is now my family''s favorite. Moist, flavorful, and the cream cheese frosting is out of this world.', true),
('Rohan Joshi', 'Jaipur', 5, 'Ordered a custom design cake for my wife''s birthday. They captured the theme perfectly and it tasted even better than it looked!', true);

-- Sample Contact Messages
INSERT INTO contact_messages (full_name, email, phone, subject, message, read) VALUES
('Amit Kumar', 'amit@example.com', '+91 9876543210', 'Wedding Cake Inquiry', 'Hi, I am planning a wedding for 200 guests and would like to discuss a custom 4-tier cake. Could you please share your wedding cake catalog and pricing?', true),
('Sneha Reddy', 'sneha@example.com', '+91 9876543211', 'Corporate Order', 'We need 50 cupcakes for our company event next month. Do you offer bulk discounts?', false),
('Rajesh Gupta', 'rajesh@example.com', '+91 9876543212', 'Allergy Information', 'My daughter has a nut allergy. Do you offer nut-free options for your cakes?', false);
