# Panduan Menambahkan Gambar Produk

## Cara 1: Via Admin Panel (Recommended)

1. **Login sebagai Admin**
   - Buka `http://localhost:3000/login`
   - Login dengan akun admin

2. **Buka Admin Dashboard**
   - Klik "Admin" di navbar
   - Pilih "Products"

3. **Edit/Tambah Produk**
   - Klik "Edit" pada produk yang ada, atau "Add Product"
   - Di field "Image URL", masukkan URL gambar
   - Gunakan tombol quick options untuk gambar sample

4. **Sample URLs yang Bisa Digunakan:**
   ```
   iPhone: https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400
   Laptop: https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400
   Headphones: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400
   Watch: https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400
   Camera: https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400
   Shoes: https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400
   ```

## Cara 2: Via Database (Quick Update)

1. **Buka MySQL/PostgreSQL client**
2. **Jalankan script SQL:**
   ```sql
   -- Update iPhone 15 Pro
   UPDATE products SET image = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' WHERE id = 1;
   
   -- Update produk lainnya
   UPDATE products SET image = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' WHERE name LIKE '%laptop%';
   ```

## Cara 3: Upload File Lokal (Advanced)

1. **Buat folder uploads di backend:**
   ```bash
   mkdir backend/uploads
   mkdir backend/uploads/products
   ```

2. **Tambahkan file upload endpoint** (sudah ada di routes)

3. **Upload gambar ke folder uploads**

4. **URL akan menjadi:** `http://localhost:8080/uploads/products/filename.jpg`

## Cara 4: Menggunakan CDN/Cloud Storage

1. **Upload ke Cloudinary/AWS S3/Google Cloud**
2. **Copy public URL**
3. **Paste ke field Image URL di admin panel**

## Tips:

- **Format yang didukung:** JPG, PNG, WebP
- **Ukuran recommended:** 400x400px atau 800x600px
- **Untuk development:** Gunakan Unsplash URLs
- **Untuk production:** Gunakan CDN atau cloud storage

## Troubleshooting:

- **Gambar tidak muncul:** Cek CORS settings
- **URL tidak valid:** Pastikan URL bisa diakses public
- **Loading lambat:** Gunakan gambar dengan ukuran yang sesuai

## Contoh Lengkap:

```javascript
// Contoh data produk dengan gambar
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced camera",
  "price": 15999000,
  "stock": 10,
  "category_id": 1,
  "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"
}
```