# Script PowerShell untuk update gambar produk
# Jalankan dengan: powershell -ExecutionPolicy Bypass -File update_images.ps1

Write-Host "Updating product images..." -ForegroundColor Green

# Daftar gambar untuk update
$updates = @(
    @{ id = 1; image = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400" },
    @{ id = 2; image = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    @{ id = 3; image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    @{ id = 4; image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    @{ id = 5; image = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" }
)

# Update setiap produk
foreach ($update in $updates) {
    try {
        $query = "UPDATE products SET image = '$($update.image)' WHERE id = $($update.id);"
        Write-Host "Would update product $($update.id) with image: $($update.image)" -ForegroundColor Yellow
        Write-Host "SQL: $query" -ForegroundColor Cyan
    }
    catch {
        Write-Host "Error updating product $($update.id): $_" -ForegroundColor Red
    }
}

Write-Host "`nTo apply these updates, run the SQL commands in your database client." -ForegroundColor Green
Write-Host "Or use the admin panel at http://localhost:3000/admin/products" -ForegroundColor Blue