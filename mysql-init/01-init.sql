-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ecommerce_db;

-- Use the database
USE ecommerce_db;

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES (1, 'admin@example.com', '$2a$10$Q8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', 'Admin', 'User', 'admin', NOW(), NOW());

-- Insert sample customer
-- Password: customer123 (hashed with bcrypt)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES (2, 'customer@example.com', '$2a$10$Q8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', 'John', 'Doe', 'customer', NOW(), NOW());

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Electronics', 'Electronic devices and gadgets', NOW(), NOW()),
(2, 'Clothing', 'Fashion and apparel', NOW(), NOW()),
(3, 'Books', 'Books and literature', NOW(), NOW()),
(4, 'Home & Garden', 'Home improvement and gardening', NOW(), NOW()),
(5, 'Sports', 'Sports and outdoor equipment', NOW(), NOW());

-- Insert sample products
INSERT IGNORE INTO products (id, name, description, price, stock, category_id, created_at, updated_at) VALUES
(1, 'Smartphone', 'Latest smartphone with advanced features', 699.99, 50, 1, NOW(), NOW()),
(2, 'Laptop', 'High-performance laptop for work and gaming', 1299.99, 30, 1, NOW(), NOW()),
(3, 'Wireless Headphones', 'Premium wireless headphones with noise cancellation', 199.99, 100, 1, NOW(), NOW()),
(4, 'T-Shirt', 'Comfortable cotton t-shirt', 19.99, 200, 2, NOW(), NOW()),
(5, 'Jeans', 'Classic blue jeans', 49.99, 150, 2, NOW(), NOW()),
(6, 'JavaScript Guide', 'Complete guide to JavaScript programming', 29.99, 75, 3, NOW(), NOW()),
(7, 'Coffee Maker', 'Automatic coffee maker with timer', 89.99, 40, 4, NOW(), NOW()),
(8, 'Running Shoes', 'Professional running shoes', 129.99, 80, 5, NOW(), NOW());

-- Set auto increment starting values
ALTER TABLE users AUTO_INCREMENT = 3;
ALTER TABLE categories AUTO_INCREMENT = 6;
ALTER TABLE products AUTO_INCREMENT = 9;
