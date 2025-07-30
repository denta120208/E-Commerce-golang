USE ecommerce_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE carts;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
DELETE FROM users WHERE email IN ('admin@example.com', 'customer@example.com');
SET FOREIGN_KEY_CHECKS = 1;

-- Insert demo users (password: admin123, customer123)
INSERT INTO users (email, password, first_name, last_name, role, created_at, updated_at) VALUES
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', NOW(), NOW()),
('customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'customer', NOW(), NOW());

-- Insert categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Electronics', 'Electronic devices and gadgets', NOW(), NOW()),
(2, 'Clothing', 'Fashion and apparel', NOW(), NOW()),
(3, 'Books', 'Books and literature', NOW(), NOW()),
(4, 'Home & Garden', 'Home improvement items', NOW(), NOW());

-- Insert products
INSERT INTO products (id, name, description, price, stock, category_id, created_at, updated_at) VALUES
-- Electronics
(1, 'iPhone 15 Pro', 'Latest iPhone with advanced camera and A17 chip', 15999000.00, 25, 1, NOW(), NOW()),
(2, 'MacBook Air M2', 'Ultra-thin laptop with Apple M2 chip', 18999000.00, 15, 1, NOW(), NOW()),
(3, 'AirPods Pro 2', 'Wireless earbuds with active noise cancellation', 3499000.00, 50, 1, NOW(), NOW()),
(4, 'Samsung Galaxy S24', 'Flagship Android smartphone with AI features', 13999000.00, 40, 1, NOW(), NOW()),

-- Clothing
(5, 'Uniqlo Basic T-Shirt', 'Comfortable cotton t-shirt in various colors', 149000.00, 100, 2, NOW(), NOW()),
(6, 'Levis 501 Jeans', 'Classic straight-fit denim jeans', 899000.00, 75, 2, NOW(), NOW()),
(7, 'Nike Air Force 1', 'Classic white sneakers for everyday wear', 1299000.00, 60, 2, NOW(), NOW()),
(8, 'Adidas Hoodie', 'Comfortable hoodie for casual wear', 599000.00, 80, 2, NOW(), NOW()),

-- Books
(9, 'Clean Code', 'A handbook of agile software craftsmanship by Robert C. Martin', 450000.00, 50, 3, NOW(), NOW()),
(10, 'The Pragmatic Programmer', 'From journeyman to master - essential reading', 520000.00, 40, 3, NOW(), NOW()),
(11, 'JavaScript: The Good Parts', 'Essential JavaScript programming guide', 380000.00, 35, 3, NOW(), NOW()),

-- Home & Garden
(12, 'IKEA Study Desk', 'Simple and functional study desk', 1200000.00, 20, 4, NOW(), NOW()),
(13, 'Philips Air Fryer', 'Healthy cooking with little to no oil', 1799000.00, 25, 4, NOW(), NOW());

-- Reset auto increment
ALTER TABLE categories AUTO_INCREMENT = 5;
ALTER TABLE products AUTO_INCREMENT = 14;

-- Verify data
SELECT 'Users:' as info;
SELECT id, email, first_name, last_name, role FROM users;

SELECT 'Categories:' as info;
SELECT id, name FROM categories;

SELECT 'Products:' as info;
SELECT id, name, price, stock, category_id FROM products LIMIT 5;
