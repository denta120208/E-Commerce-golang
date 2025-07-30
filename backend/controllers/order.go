package controllers

import (
	"net/http"
	"strconv"
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"github.com/gin-gonic/gin"
)

type CreateOrderRequest struct {
	ShippingAddress string `json:"shipping_address" binding:"required"`
	PaymentMethod   string `json:"payment_method" binding:"required"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func GetOrders(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Calculate offset
	offset := (page - 1) * limit

	// Get total count
	var totalCount int64
	database.DB.Model(&models.Order{}).Where("user_id = ?", userID).Count(&totalCount)

	// Get orders with pagination
	var orders []models.Order
	if err := database.DB.Preload("OrderItems.Product.Category").Where("user_id = ?", userID).
		Order("created_at DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// Convert to response format
	var orderResponses []models.OrderResponse
	for _, order := range orders {
		orderResponses = append(orderResponses, order.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{
		"orders":      orderResponses,
		"total":       totalCount,
		"page":        page,
		"limit":       limit,
		"total_pages": (totalCount + int64(limit) - 1) / int64(limit),
	})
}

func GetOrder(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	id := c.Param("id")
	orderID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	var order models.Order
	if err := database.DB.Preload("OrderItems.Product.Category").
		Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order": order.ToResponse(),
	})
}

func CreateOrder(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user's cart items
	var cartItems []models.Cart
	if err := database.DB.Preload("Product").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
		return
	}

	if len(cartItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Calculate total amount and validate stock
	var totalAmount float64
	for _, item := range cartItems {
		if item.Product.Stock < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient stock for product: " + item.Product.Name,
			})
			return
		}
		totalAmount += item.Product.Price * float64(item.Quantity)
	}

	// Start transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Create order
	order := models.Order{
		UserID:          userID.(uint),
		TotalAmount:     totalAmount,
		Status:          "pending",
		ShippingAddress: req.ShippingAddress,
		PaymentMethod:   req.PaymentMethod,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Create order items and update product stock
	for _, item := range cartItems {
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Product.Price,
		}

		if err := tx.Create(&orderItem).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order item"})
			return
		}

		// Update product stock
		if err := tx.Model(&item.Product).Update("stock", item.Product.Stock-item.Quantity).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product stock"})
			return
		}
	}

	// Clear user's cart
	if err := tx.Where("user_id = ?", userID).Delete(&models.Cart{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear cart"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete order"})
		return
	}

	// Load order with relations
	database.DB.Preload("OrderItems.Product.Category").First(&order, order.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully",
		"order":   order.ToResponse(),
	})
}

func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	orderID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	var req UpdateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status
	validStatuses := []string{"pending", "confirmed", "processing", "shipped", "delivered", "cancelled"}
	isValidStatus := false
	for _, status := range validStatuses {
		if req.Status == status {
			isValidStatus = true
			break
		}
	}

	if !isValidStatus {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order status"})
		return
	}

	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Handle cancellation logic
	if req.Status == "cancelled" && order.Status != "cancelled" {
		// Restore product stock
		var orderItems []models.OrderItem
		if err := database.DB.Preload("Product").Where("order_id = ?", orderID).Find(&orderItems).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order items"})
			return
		}

		tx := database.DB.Begin()
		for _, item := range orderItems {
			if err := tx.Model(&item.Product).Update("stock", item.Product.Stock+item.Quantity).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore product stock"})
				return
			}
		}
		tx.Commit()
	}

	order.Status = req.Status
	if err := database.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	// Load order with relations
	database.DB.Preload("OrderItems.Product.Category").First(&order, order.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Order status updated successfully",
		"order":   order.ToResponse(),
	})
}

func GetAllOrders(c *gin.Context) {
	// Get query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")

	// Calculate offset
	offset := (page - 1) * limit

	// Build query
	query := database.DB.Model(&models.Order{}).Preload("User").Preload("OrderItems.Product.Category")

	// Filter by status if provided
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Get total count
	var totalCount int64
	query.Count(&totalCount)

	// Get orders with pagination
	var orders []models.Order
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// Convert to response format
	var orderResponses []models.OrderResponse
	for _, order := range orders {
		orderResponses = append(orderResponses, order.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{
		"orders":      orderResponses,
		"total":       totalCount,
		"page":        page,
		"limit":       limit,
		"total_pages": (totalCount + int64(limit) - 1) / int64(limit),
	})
}
