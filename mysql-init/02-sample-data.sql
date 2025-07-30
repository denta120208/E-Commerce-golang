-- Use the database
USE ecommerce_db;

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES (1, 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdCW.1pR8v2t4h8S6', 'Admin', 'User', 'admin', NOW(), NOW());

-- Insert sample customer (password: customer123)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, phone, address, role, created_at, updated_at) 
VALUES (2, 'customer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdCW.1pR8v2t4h8S6', 'John', 'Doe', '081234567890', '123 Main Street, Jakarta', 'customer', NOW(), NOW());

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, description, image, created_at, updated_at) VALUES
(1, 'Electronics', 'Electronic devices and gadgets', '', NOW(), NOW()),
(2, 'Clothing', 'Fashion and apparel', '', NOW(), NOW()),
(3, 'Books', 'Books and literature', '', NOW(), NOW()),
(4, 'Home & Garden', 'Home improvement and gardening items', '', NOW(), NOW()),
(5, 'Sports', 'Sports and outdoor equipment', '', NOW(), NOW()),
(6, 'Beauty', 'Beauty and personal care products', '', NOW(), NOW());

-- Insert sample products
INSERT IGNORE INTO products (id, name, description, price, stock, image, category_id, created_at, updated_at) VALUES
-- Electronics
(1, 'iPhone 15 Pro', 'Latest iPhone with advanced camera and A17 chip', 15999000.00, 25, '', 1, NOW(), NOW()),
(2, 'MacBook Air M2', 'Ultra-thin laptop with Apple M2 chip', 18999000.00, 15, '', 1, NOW(), NOW()),
(3, 'AirPods Pro 2', 'Wireless earbuds with active noise cancellation', 3499000.00, 50, '', 1, NOW(), NOW()),
(4, 'iPad Air', 'Powerful tablet for work and creativity', 8999000.00, 30, '', 1, NOW(), NOW()),
(5, 'Samsung Galaxy S24', 'Flagship Android smartphone', 13999000.00, 40, '', 1, NOW(), NOW()),

-- Clothing
(6, 'Uniqlo Basic T-Shirt', 'Comfortable cotton t-shirt', 149000.00, 100, '', 2, NOW(), NOW()),
(7, 'Levis 501 Jeans', 'Classic straight-fit jeans', 899000.00, 75, '', 2, NOW(), NOW()),
(8, 'Nike Air Force 1', 'Classic white sneakers', 1299000.00, 60, '', 2, NOW(), NOW()),
(9, 'Adidas Hoodie', 'Comfortable hoodie for casual wear', 599000.00, 80, '', 2, NOW(), NOW()),

-- Books
(10, 'Clean Code by Robert Martin', 'A handbook of agile software craftsmanship', 450000.00, 50, '', 3, NOW(), NOW()),
(11, 'The Pragmatic Programmer', 'From journeyman to master', 520000.00, 40, '', 3, NOW(), NOW()),
(12, 'JavaScript: The Good Parts', 'Essential JavaScript programming guide', 380000.00, 35, '', 3, NOW(), NOW()),

-- Home & Garden
(13, 'IKEA Study Desk', 'Simple and functional study desk', 1200000.00, 20, '', 4, NOW(), NOW()),
(14, 'Philips Air Fryer', 'Healthy cooking with little to no oil', 1799000.00, 25, '', 4, NOW(), NOW()),
(15, 'Xiaomi Rice Cooker', 'Smart rice cooker with app control', 899000.00, 30, '', 4, NOW(), NOW()),

-- Sports
(16, 'Nike Running Shoes', 'Professional running shoes for athletes', 1599000.00, 45, '', 5, NOW(), NOW()),
(17, 'Yoga Mat Premium', 'Non-slip yoga mat for home workout', 299000.00, 70, '', 5, NOW(), NOW()),
(18, 'Dumbell Set 20kg', 'Adjustable dumbbell for home gym', 1200000.00, 15, '', 5, NOW(), NOW()),

-- Beauty
(19, 'Wardah Sunscreen SPF 30', 'Daily protection from UV rays', 45000.00, 100, '', 6, NOW(), NOW()),
(20, 'The Ordinary Serum', 'Niacinamide serum for skin care', 120000.00, 80, '', 6, NOW(), NOW());

-- Update auto increment
ALTER TABLE users AUTO_INCREMENT = 3;
ALTER TABLE categories AUTO_INCREMENT = 7;
ALTER TABLE products AUTO_INCREMENT = 21;
