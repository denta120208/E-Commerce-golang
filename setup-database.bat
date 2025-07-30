@echo off
echo Setting up MySQL database for E-Commerce project...
echo.

echo Step 1: Starting MySQL container...
docker-compose -f docker-compose.dev.yml up -d mysql

echo.
echo Waiting for MySQL to be ready (30 seconds)...
timeout /t 30 /nobreak > nul

echo.
echo Step 2: Starting phpMyAdmin...
docker-compose -f docker-compose.dev.yml up -d phpmyadmin

echo.
echo ========================================
echo Database setup completed!
echo ========================================
echo.
echo MySQL Database:
echo - Host: localhost
echo - Port: 3306
echo - Database: ecommerce_db
echo - Username: ecommerce_user
echo - Password: ecommerce_pass123
echo - Root Password: rootpassword123
echo.
echo phpMyAdmin:
echo - URL: http://localhost:8081
echo - Username: root
echo - Password: rootpassword123
echo.
echo Demo Accounts:
echo - Admin: admin@example.com / admin123
echo - Customer: customer@example.com / customer123
echo.
echo Next steps:
echo 1. Go to backend folder: cd backend
echo 2. Run backend: go run main.go
echo 3. Go to frontend folder: cd ../frontend  
echo 4. Install deps: npm install
echo 5. Run frontend: npm run dev
echo.
pause
