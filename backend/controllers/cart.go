package controllers

import (
	"net/http"
	"strconv"
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"github.com/gin-gonic/gin"
)

type AddToCartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" binding:"required,gt=0"`
}

func GetCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var cartItems []models.Cart
	if err := database.DB.Preload("Product.Category").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items"})
		return
	}

	// Convert to response format and calculate totals
	var cartResponses []models.CartResponse
	var totalAmount float64
	var totalItems int

	for _, item := range cartItems {
		cartResponse := item.ToResponse()
		cartResponses = append(cartResponses, cartResponse)
		totalAmount += cartResponse.Subtotal
		totalItems += item.Quantity
	}

	c.JSON(http.StatusOK, gin.H{
		"cart_items":   cartResponses,
		"total_amount": totalAmount,
		"total_items":  totalItems,
	})
}

func AddToCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify product exists and has enough stock
	var product models.Product
	if err := database.DB.First(&product, req.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if product.Stock < req.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Check if item already exists in cart
	var existingCartItem models.Cart
	if err := database.DB.Where("user_id = ? AND product_id = ?", userID, req.ProductID).First(&existingCartItem).Error; err == nil {
		// Update existing item quantity
		newQuantity := existingCartItem.Quantity + req.Quantity
		if product.Stock < newQuantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for requested quantity"})
			return
		}

		existingCartItem.Quantity = newQuantity
		if err := database.DB.Save(&existingCartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}

		// Load product relation
		database.DB.Preload("Product.Category").First(&existingCartItem, existingCartItem.ID)

		c.JSON(http.StatusOK, gin.H{
			"message":   "Cart item updated successfully",
			"cart_item": existingCartItem.ToResponse(),
		})
		return
	}

	// Create new cart item
	cartItem := models.Cart{
		UserID:    userID.(uint),
		ProductID: req.ProductID,
		Quantity:  req.Quantity,
	}

	if err := database.DB.Create(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	// Load product relation
	database.DB.Preload("Product.Category").First(&cartItem, cartItem.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Item added to cart successfully",
		"cart_item": cartItem.ToResponse(),
	})
}

func UpdateCartItem(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	id := c.Param("id")
	cartItemID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item ID"})
		return
	}

	var req UpdateCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cartItem models.Cart
	if err := database.DB.Preload("Product").Where("id = ? AND user_id = ?", cartItemID, userID).First(&cartItem).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Check stock availability
	if cartItem.Product.Stock < req.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	cartItem.Quantity = req.Quantity
	if err := database.DB.Save(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}

	// Load product relation
	database.DB.Preload("Product.Category").First(&cartItem, cartItem.ID)

	c.JSON(http.StatusOK, gin.H{
		"message":   "Cart item updated successfully",
		"cart_item": cartItem.ToResponse(),
	})
}

func RemoveFromCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	id := c.Param("id")
	cartItemID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart item ID"})
		return
	}

	var cartItem models.Cart
	if err := database.DB.Where("id = ? AND user_id = ?", cartItemID, userID).First(&cartItem).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	if err := database.DB.Delete(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item from cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item removed from cart successfully",
	})
}

func ClearCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	if err := database.DB.Where("user_id = ?", userID).Delete(&models.Cart{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart cleared successfully",
	})
}
