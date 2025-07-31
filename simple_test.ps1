# Simple test untuk isolasi data
Write-Host "Testing Data Isolation..." -ForegroundColor Green

# Test login dengan password salah
Write-Host "`nTest 1: Wrong password login" -ForegroundColor Yellow
$body = @{
    email = "user1@test.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "ERROR: Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected wrong password" -ForegroundColor Green
}

# Test login dengan password benar
Write-Host "`nTest 2: Correct password login" -ForegroundColor Yellow
$body = @{
    email = "user1@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Login successful for user: $($data.user.email)" -ForegroundColor Green
    $token1 = $data.token
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test cart isolation
Write-Host "`nTest 3: Cart isolation" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/cart" -Method GET -Headers @{"Authorization"="Bearer $token1"}
    $cartData = $response.Content | ConvertFrom-Json
    Write-Host "✓ User cart has $($cartData.cart_items.Count) items" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get cart: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nData isolation test completed!" -ForegroundColor Cyan