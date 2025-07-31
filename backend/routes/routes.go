package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Serve static files for uploads
	r.Static("/uploads", "./uploads")

	// API v1 routes
	api := r.Group("/api/v1")

	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.GET("/profile", middlewares.AuthMiddleware(), controllers.GetProfile)
		auth.PUT("/profile", middlewares.AuthMiddleware(), controllers.UpdateProfile)
	}

	// Categories routes
	categories := api.Group("/categories")
	{
		categories.GET("", controllers.GetCategories)
		categories.GET("/:id", controllers.GetCategory)

		// Admin only routes
		adminCategories := categories.Use(middlewares.AuthMiddleware(), middlewares.AdminMiddleware())
		{
			adminCategories.POST("", controllers.CreateCategory)
			adminCategories.PUT("/:id", controllers.UpdateCategory)
			adminCategories.DELETE("/:id", controllers.DeleteCategory)
		}
	}

	// Products routes
	products := api.Group("/products")
	{
		products.GET("", controllers.GetProducts)
		products.GET("/:id", controllers.GetProduct)

		// Admin only routes
		adminProducts := products.Use(middlewares.AuthMiddleware(), middlewares.AdminMiddleware())
		{
			adminProducts.POST("", controllers.CreateProduct)
			adminProducts.PUT("/:id", controllers.UpdateProduct)
			adminProducts.DELETE("/:id", controllers.DeleteProduct)
		}
	}

	// Cart routes (authenticated users only)
	cart := api.Group("/cart").Use(middlewares.AuthMiddleware())
	{
		cart.GET("", controllers.GetCart)
		cart.POST("/add", controllers.AddToCart)
		cart.PUT("/item/:id", controllers.UpdateCartItem)
		cart.DELETE("/item/:id", controllers.RemoveFromCart)
		cart.DELETE("/clear", controllers.ClearCart)
	}

	// Orders routes (authenticated users only)
	orders := api.Group("/orders").Use(middlewares.AuthMiddleware())
	{
		orders.GET("", controllers.GetOrders)
		orders.GET("/:id", controllers.GetOrder)
		orders.POST("", controllers.CreateOrder)

		// Admin only routes
		adminOrders := orders.Use(middlewares.AdminMiddleware())
		{
			adminOrders.GET("/all", controllers.GetAllOrders)
			adminOrders.PUT("/:id/status", controllers.UpdateOrderStatus)
		}
	}

	// Users routes (admin only)
	users := api.Group("/users").Use(middlewares.AuthMiddleware(), middlewares.AdminMiddleware())
	{
		users.GET("", controllers.GetUsers)
		users.GET("/:id", controllers.GetUser)
		users.PUT("/:id", controllers.UpdateUser)
		users.DELETE("/:id", controllers.DeleteUser)
	}

	// Health check
	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "OK",
			"message": "Server is running",
		})
	})

	return r
}
