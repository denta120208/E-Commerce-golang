-- Script untuk update gambar produk yang sudah ada
-- Jalankan di database MySQL/PostgreSQL

-- Update iPhone 15 Pro
UPDATE products SET image = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' WHERE id = 1;

-- Update produk lainnya (sesuaikan dengan ID yang ada)
UPDATE products SET image = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' WHERE name LIKE '%laptop%' OR name LIKE '%MacBook%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' WHERE name LIKE '%headphone%' OR name LIKE '%earphone%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' WHERE name LIKE '%watch%' OR name LIKE '%smartwatch%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' WHERE name LIKE '%camera%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' WHERE name LIKE '%shoe%' OR name LIKE '%sneaker%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' WHERE name LIKE '%shirt%' OR name LIKE '%t-shirt%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' WHERE name LIKE '%jean%' OR name LIKE '%pants%';

UPDATE products SET image = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' WHERE name LIKE '%book%';

-- Untuk produk yang belum ada gambar, set default placeholder
UPDATE products SET image = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' WHERE image IS NULL OR image = '';

-- Cek hasil update
SELECT id, name, image FROM products LIMIT 10;