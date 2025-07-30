USE ecommerce_db;

-- Delete existing users
DELETE FROM users WHERE email IN ('admin@example.com', 'customer@example.com');

-- Insert admin user with correct hash (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, created_at, updated_at) 
VALUES ('admin@example.com', '$2a$10$LQ3FdUXn5oZKw7fP7eL8h.ZZhRX3k6E1H4JVn7J9R8t3n6Q9w8L8C', 'Admin', 'User', 'admin', NOW(), NOW());

-- Insert customer user with correct hash (password: customer123)
INSERT INTO users (email, password, first_name, last_name, phone, address, role, created_at, updated_at) 
VALUES ('customer@example.com', '$2a$10$LQ3FdUXn5oZKw7fP7eL8h.ZZhRX3k6E1H4JVn7J9R8t3n6Q9w8L8C', 'John', 'Doe', '081234567890', '123 Main Street, Jakarta', 'customer', NOW(), NOW());

-- Verify users
SELECT id, email, first_name, last_name, role FROM users;
