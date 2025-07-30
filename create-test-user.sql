USE ecommerce_db;

-- Delete existing demo users
DELETE FROM users WHERE email IN ('admin@example.com', 'customer@example.com', 'test@example.com');

-- Create test user with known password hash
-- Password: admin123 (hash created with bcrypt cost 10)
INSERT INTO users (email, password, first_name, last_name, role, created_at, updated_at) VALUES
('admin@example.com', '$2a$10$LQ3FdUXn5oZKw7fP7eL8h.ZZhRX3k6E1H4JVn7J9R8t3n6Q9w8L8C', 'Admin', 'User', 'admin', NOW(), NOW());

-- Password: customer123 (hash created with bcrypt cost 10)  
INSERT INTO users (email, password, first_name, last_name, phone, address, role, created_at, updated_at) VALUES
('customer@example.com', '$2a$10$LQ3FdUXn5oZKw7fP7eL8h.ZZhRX3k6E1H4JVn7J9R8t3n6Q9w8L8C', 'John', 'Doe', '081234567890', '123 Main Street, Jakarta', 'customer', NOW(), NOW());

-- Password: test123 (for new registrations)
INSERT INTO users (email, password, first_name, last_name, role, created_at, updated_at) VALUES
('test@example.com', '$2a$10$LQ3FdUXn5oZKw7fP7eL8h.ZZhRX3k6E1H4JVn7J9R8t3n6Q9w8L8C', 'Test', 'User', 'customer', NOW(), NOW());

-- Verify users
SELECT id, email, first_name, last_name, role FROM users;
