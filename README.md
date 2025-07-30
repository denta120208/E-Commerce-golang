# 🛒 E-Commerce Fullstack Application

Proyek e-commerce fullstack lengkap dengan struktur monorepo menggunakan **Golang + Gin** untuk backend, **React + TypeScript** untuk frontend, dan **MySQL** sebagai database.

## 🚀 Tech Stack

### Backend
- **Golang** + **Gin** (REST API)
- **GORM** (ORM)
- **MySQL** (Database)
- **JWT** (Authentication)
- **bcrypt** (Password Hashing)

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router** (Navigation)
- **Axios** (HTTP Client)
- **React Hook Form** + **Yup** (Form Validation)

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** (Production)
- **phpMyAdmin** (Database Management)

## 📁 Struktur Proyek

```
ecommerce-app/
├── backend/                 # Golang API
│   ├── controllers/         # API Controllers
│   ├── models/             # Database Models
│   ├── routes/             # API Routes
│   ├── middlewares/        # Auth & CORS Middlewares
│   ├── database/           # Database Connection
│   ├── config/             # Configuration
│   ├── utils/              # JWT & Hash Utilities
│   ├── uploads/            # File Uploads
│   ├── main.go             # Entry Point
│   ├── go.mod              # Go Dependencies
│   └── Dockerfile          # Docker Config
├── frontend/               # React TypeScript
│   ├── src/
│   │   ├── pages/          # React Pages
│   │   ├── components/     # Reusable Components
│   │   ├── services/       # API Services
│   │   ├── hooks/          # Custom Hooks
│   │   ├── context/        # React Context
│   │   ├── types/          # TypeScript Types
│   │   └── App.tsx         # Main App Component
│   ├── public/             # Static Assets
│   ├── package.json        # Dependencies
│   ├── vite.config.ts      # Vite Configuration
│   ├── tailwind.config.js  # Tailwind CSS Config
│   └── Dockerfile          # Docker Config
├── mysql-init/             # Database Initialization
├── docker-compose.yml      # Docker Compose Config
├── .env                    # Environment Variables
├── .env.example            # Environment Template
└── README.md              # Documentation
```

## ✨ Fitur Aplikasi

### 🔐 Authentication & Authorization
- [x] User Registration
- [x] User Login/Logout
- [x] JWT Token Authentication
- [x] Role-based Access (Admin/Customer)
- [x] Protected Routes
- [x] Password Hashing (bcrypt)

### 🛍️ Customer Features
- [x] Browse Products
- [x] Product Search & Filter
- [x] Product Categories
- [x] Product Detail View
- [x] Shopping Cart Management
- [x] Add/Update/Remove Cart Items
- [x] Checkout Process
- [x] Order History
- [x] User Profile Management

### 👨‍💼 Admin Features
- [x] Admin Dashboard
- [x] Product Management (CRUD)
- [x] Category Management (CRUD)
- [x] Order Management
- [x] User Management
- [x] Order Status Updates

### 🎨 UI/UX Features
- [x] Responsive Design
- [x] Loading States
- [x] Error Handling
- [x] Form Validation
- [x] Toast Notifications
- [x] Mobile-Friendly Navigation

## 🔧 Cara Menjalankan Aplikasi

### Prasyarat
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (untuk development)
- [Go](https://golang.org/) (untuk development)

### 1. Menggunakan Docker Compose (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd ecommerce-app

# Copy environment file
cp .env.example .env

# Jalankan semua services
docker-compose up --build

# Atau untuk background
docker-compose up -d --build
```

**Services yang akan berjalan:**
- 🌐 Frontend: http://localhost:3000
- 🔗 Backend API: http://localhost:8080
- 🗄️ MySQL: localhost:3306
- 🛠️ phpMyAdmin: http://localhost:8081

### 2. Development Manual

#### Backend (Golang)
```bash
cd backend

# Install dependencies
go mod download

# Setup environment
cp ../.env.example .env

# Run MySQL (with Docker)
docker run --name mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=ecommerce_db -p 3306:3306 -d mysql:8.0

# Run application
go run main.go
```

#### Frontend (React)
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔑 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    # User Registration
POST   /api/v1/auth/login       # User Login
GET    /api/v1/auth/profile     # Get User Profile
PUT    /api/v1/auth/profile     # Update Profile
```

### Products
```
GET    /api/v1/products         # Get All Products
GET    /api/v1/products/:id     # Get Product by ID
POST   /api/v1/products         # Create Product (Admin)
PUT    /api/v1/products/:id     # Update Product (Admin)
DELETE /api/v1/products/:id     # Delete Product (Admin)
```

### Categories
```
GET    /api/v1/categories       # Get All Categories
GET    /api/v1/categories/:id   # Get Category by ID
POST   /api/v1/categories       # Create Category (Admin)
PUT    /api/v1/categories/:id   # Update Category (Admin)
DELETE /api/v1/categories/:id   # Delete Category (Admin)
```

### Cart
```
GET    /api/v1/cart             # Get User Cart
POST   /api/v1/cart/add         # Add Item to Cart
PUT    /api/v1/cart/item/:id    # Update Cart Item
DELETE /api/v1/cart/item/:id    # Remove Cart Item
DELETE /api/v1/cart/clear       # Clear Cart
```

### Orders
```
GET    /api/v1/orders           # Get User Orders
GET    /api/v1/orders/:id       # Get Order by ID
POST   /api/v1/orders           # Create Order
GET    /api/v1/orders/all       # Get All Orders (Admin)
PUT    /api/v1/orders/:id/status # Update Order Status (Admin)
```

## 🧪 Default Accounts

Untuk testing, gunakan akun default berikut:

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123

### Customer Account
- **Email:** customer@example.com
- **Password:** customer123

## 🔧 Konfigurasi Environment

Edit file `.env` untuk konfigurasi:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_password
DB_NAME=ecommerce_db

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=8080

# Frontend
VITE_API_URL=http://localhost:8080/api/v1
```

## 📦 Database Schema

### Users
- `id`, `email`, `password`, `first_name`, `last_name`, `phone`, `address`, `role`, `created_at`, `updated_at`

### Categories
- `id`, `name`, `description`, `image`, `created_at`, `updated_at`

### Products
- `id`, `name`, `description`, `price`, `stock`, `image`, `category_id`, `created_at`, `updated_at`

### Cart
- `id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`

### Orders
- `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `payment_method`, `created_at`, `updated_at`

### Order Items
- `id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`

## 🚀 Deployment

### Production dengan Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d

# Setup HTTPS dengan Let's Encrypt (optional)
# Configure nginx-proxy or traefik
```

### Environment Variables untuk Production

```env
NODE_ENV=production
JWT_SECRET=your-very-secure-secret-key
DB_PASSWORD=secure-database-password
ALLOWED_ORIGINS=https://yourdomain.com
```

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Format code
go fmt ./...

# Run tests
go test ./...

# Build binary
go build -o main .

# Install dependencies
go mod tidy
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔍 Testing

### Manual Testing
1. Jalankan aplikasi dengan Docker Compose
2. Buka http://localhost:3000
3. Register akun baru atau login dengan akun default
4. Test semua fitur (browse products, add to cart, checkout, dll)

### API Testing
Gunakan tools seperti Postman atau Insomnia untuk test API endpoints:
- Import collection dari `docs/postman_collection.json` (jika ada)
- Test authentication, CRUD operations, dll

## 🐛 Troubleshooting

### Common Issues

1. **Port sudah digunakan**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8080
   
   # Stop conflicting services
   docker-compose down
   ```

2. **Database connection error**
   ```bash
   # Reset database
   docker-compose down -v
   docker-compose up --build
   ```

3. **Permission errors (Linux/Mac)**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Node modules issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:
- 🐛 Buat issue di GitHub
- 📧 Email: support@ecommerce.com
- 📖 Check documentation di `/docs`

---

**Happy Coding! 🚀**
