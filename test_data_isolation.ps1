# Script untuk test isolasi data antar user
# Pastikan server backend berjalan di localhost:8080

Write-Host "=== Testing Data Isolation Between Users ===" -ForegroundColor Green

# Test 1: Login dengan kredensial salah
Write-Host "`n1. Testing login with wrong credentials..." -ForegroundColor Yellow
try {
    $body = @{
        email = "user1@test.com"
        password = "wrongpassword"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "ERROR: Login should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Login correctly rejected with wrong password" -ForegroundColor Green
}

# Test 2: Login dengan kredensial benar
Write-Host "`n2. Testing login with correct credentials..." -ForegroundColor Yellow
try {
    $body = @{
        email = "user1@test.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
    $loginData = $response.Content | ConvertFrom-Json
    $token1 = $loginData.token
    $user1Id = $loginData.user.id
    Write-Host "✓ User1 login successful (ID: $user1Id)" -ForegroundColor Green
} catch {
    Write-Host "✗ User1 login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Login user kedua
Write-Host "`n3. Testing second user login..." -ForegroundColor Yellow
try {
    $body = @{
        email = "user2@test.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
    $loginData = $response.Content | ConvertFrom-Json
    $token2 = $loginData.token
    $user2Id = $loginData.user.id
    Write-Host "✓ User2 login successful (ID: $user2Id)" -ForegroundColor Green
} catch {
    Write-Host "✗ User2 login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: User1 menambahkan item ke cart
Write-Host "`n4. User1 adding item to cart..." -ForegroundColor Yellow
try {
    $body = @{
        product_id = 1
        quantity = 2
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/cart/add" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization"="Bearer $token1"}
    Write-Host "✓ User1 added item to cart" -ForegroundColor Green
} catch {
    Write-Host "✗ User1 failed to add item: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: User2 menambahkan item berbeda ke cart
Write-Host "`n5. User2 adding different item to cart..." -ForegroundColor Yellow
try {
    $body = @{
        product_id = 2
        quantity = 1
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/cart/add" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization"="Bearer $token2"}
    Write-Host "✓ User2 added item to cart" -ForegroundColor Green
} catch {
    Write-Host "✗ User2 failed to add item: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Verifikasi User1 hanya melihat cart sendiri
Write-Host "`n6. Verifying User1 cart isolation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/cart" -Method GET -Headers @{"Authorization"="Bearer $token1"}
    $cartData = $response.Content | ConvertFrom-Json
    
    if ($cartData.cart_items.Count -eq 1 -and $cartData.cart_items[0].product_id -eq 1) {
        Write-Host "✓ User1 sees only their own cart items (Product ID: 1)" -ForegroundColor Green
    } else {
        Write-Host "✗ User1 cart isolation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get User1 cart: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Verifikasi User2 hanya melihat cart sendiri
Write-Host "`n7. Verifying User2 cart isolation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/cart" -Method GET -Headers @{"Authorization"="Bearer $token2"}
    $cartData = $response.Content | ConvertFrom-Json
    
    if ($cartData.cart_items.Count -eq 1 -and $cartData.cart_items[0].product_id -eq 2) {
        Write-Host "✓ User2 sees only their own cart items (Product ID: 2)" -ForegroundColor Green
    } else {
        Write-Host "✗ User2 cart isolation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get User2 cart: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: User1 membuat order
Write-Host "`n8. User1 creating order..." -ForegroundColor Yellow
try {
    $body = @{
        shipping_address = "User1 Address, Street 123"
        payment_method = "credit_card"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/orders" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization"="Bearer $token1"}
    $orderData = $response.Content | ConvertFrom-Json
    $order1Id = $orderData.order.id
    Write-Host "✓ User1 created order (ID: $order1Id)" -ForegroundColor Green
} catch {
    Write-Host "✗ User1 failed to create order: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: User2 membuat order
Write-Host "`n9. User2 creating order..." -ForegroundColor Yellow
try {
    $body = @{
        shipping_address = "User2 Address, Avenue 456"
        payment_method = "debit_card"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/orders" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization"="Bearer $token2"}
    $orderData = $response.Content | ConvertFrom-Json
    $order2Id = $orderData.order.id
    Write-Host "✓ User2 created order (ID: $order2Id)" -ForegroundColor Green
} catch {
    Write-Host "✗ User2 failed to create order: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Verifikasi User1 hanya melihat orders sendiri
Write-Host "`n10. Verifying User1 order isolation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/orders" -Method GET -Headers @{"Authorization"="Bearer $token1"}
    $ordersData = $response.Content | ConvertFrom-Json
    
    $user1Orders = $ordersData.orders | Where-Object { $_.user_id -eq $user1Id }
    $otherUserOrders = $ordersData.orders | Where-Object { $_.user_id -ne $user1Id }
    
    if ($user1Orders.Count -gt 0 -and $otherUserOrders.Count -eq 0) {
        Write-Host "✓ User1 sees only their own orders" -ForegroundColor Green
    } else {
        Write-Host "✗ User1 order isolation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get User1 orders: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 11: Verifikasi User2 hanya melihat orders sendiri
Write-Host "`n11. Verifying User2 order isolation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/orders" -Method GET -Headers @{"Authorization"="Bearer $token2"}
    $ordersData = $response.Content | ConvertFrom-Json
    
    $user2Orders = $ordersData.orders | Where-Object { $_.user_id -eq $user2Id }
    $otherUserOrders = $ordersData.orders | Where-Object { $_.user_id -ne $user2Id }
    
    if ($user2Orders.Count -gt 0 -and $otherUserOrders.Count -eq 0) {
        Write-Host "✓ User2 sees only their own orders" -ForegroundColor Green
    } else {
        Write-Host "✗ User2 order isolation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get User2 orders: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 12: User1 mencoba akses order User2 (harus gagal)
Write-Host "`n12. Testing cross-user order access (should fail)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/orders/$order2Id" -Method GET -Headers @{"Authorization"="Bearer $token1"} -ErrorAction Stop
    Write-Host "✗ User1 should NOT be able to access User2's order!" -ForegroundColor Red
} catch {
    Write-Host "✓ User1 correctly denied access to User2's order" -ForegroundColor Green
}

Write-Host "`n=== Data Isolation Test Complete ===" -ForegroundColor Green
Write-Host "If all tests show ✓, then data isolation is working correctly!" -ForegroundColor Cyan