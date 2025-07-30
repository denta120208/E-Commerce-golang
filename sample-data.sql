USE ecommerce_db;

-- Insert sample admin user (password: admin123)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES (1, 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdCW.1pR8v2t4h8S6', 'Admin', 'User', 'admin', NOW(), NOW());

-- Insert sample customer (password: customer123)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, phone, address, role, created_at, updated_at) 
VALUES (2, 'customer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdCW.1pR8v2t4h8S6', 'John', 'Doe', '081234567890', '123 Main Street, Jakarta', 'customer', NOW(), NOW());

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Electronics', 'Electronic devices and gadgets', NOW(), NOW()),
(2, 'Clothing', 'Fashion and apparel', NOW(), NOW()),
(3, 'Books', 'Books and literature', NOW(), NOW()),
(4, 'Home & Garden', 'Home improvement and gardening', NOW(), NOW()),
(5, 'Sports', 'Sports and outdoor equipment', NOW(), NOW());

-- Insert sample products
INSERT IGNORE INTO products (id, name, description, price, stock, category_id, created_at, updated_at) VALUES
-- Electronics
(1, 'iPhone 15 Pro', 'Latest iPhone with advanced camera and A17 chip', 15999000.00, 25, 1, NOW(), NOW()),
(2, 'MacBook Air M2', 'Ultra-thin laptop with Apple M2 chip', 18999000.00, 15, 1, NOW(), NOW()),
(3, 'AirPods Pro 2', 'Wireless earbuds with active noise cancellation', 3499000.00, 50, 1, NOW(), NOW()),
(4, 'Samsung Galaxy S24', 'Flagship Android smartphone', 13999000.00, 40, 1, NOW(), NOW()),

-- Clothing
(5, 'Uniqlo Basic T-Shirt', 'Comfortable cotton t-shirt', 149000.00, 100, 2, NOW(), NOW()),
(6, 'Levis 501 Jeans', 'Classic straight-fit jeans', 899000.00, 75, 2, NOW(), NOW()),
(7, 'Nike Air Force 1', 'Classic white sneakers', 1299000.00, 60, 2, NOW(), NOW()),
(8, 'Adidas Hoodie', 'Comfortable hoodie for casual wear', 599000.00, 80, 2, NOW(), NOW()),

-- Books
(9, 'Clean Code by Robert Martin', 'A handbook of agile software craftsmanship', 450000.00, 50, 3, NOW(), NOW()),
(10, 'The Pragmatic Programmer', 'From journeyman to master', 520000.00, 40, 3, NOW(), NOW()),
(11, 'JavaScript: The Good Parts', 'Essential JavaScript programming guide', 380000.00, 35, 3, NOW(), NOW()),

-- Home & Garden
(12, 'IKEA Study Desk', 'Simple and functional study desk', 1200000.00, 20, 4, NOW(), NOW()),
(13, 'Philips Air Fryer', 'Healthy cooking with little to no oil', 1799000.00, 25, 4, NOW(), NOW()),

-- Sports
(14, 'Nike Running Shoes', 'Professional running shoes for athletes', 1599000.00, 45, 5, NOW(), NOW()),
(15, 'Yoga Mat Premium', 'Non-slip yoga mat for home workout', 299000.00, 70, 5, NOW(), NOW());

-- Update auto increment
ALTER TABLE users AUTO_INCREMENT = 3;
ALTER TABLE categories AUTO_INCREMENT = 6;
ALTER TABLE products AUTO_INCREMENT = 16;
