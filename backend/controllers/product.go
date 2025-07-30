package controllers

import (
	"net/http"
	"strconv"
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"github.com/gin-gonic/gin"
)

type CreateProductRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,gt=0"`
	Stock       int     `json:"stock" binding:"required,gte=0"`
	Image       string  `json:"image"`
	CategoryID  uint    `json:"category_id" binding:"required"`
}

type UpdateProductRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Image       string  `json:"image"`
	CategoryID  uint    `json:"category_id"`
}

func GetProducts(c *gin.Context) {
	// Get query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	categoryID := c.Query("category_id")
	search := c.Query("search")

	// Calculate offset
	offset := (page - 1) * limit

	// Build query
	query := database.DB.Model(&models.Product{}).Preload("Category")

	// Filter by category if provided
	if categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	// Search by name if provided
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	// Get total count
	var totalCount int64
	query.Count(&totalCount)

	// Get products with pagination
	var products []models.Product
	if err := query.Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Convert to response format
	var productResponses []models.ProductResponse
	for _, product := range products {
		productResponses = append(productResponses, product.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{
		"products":    productResponses,
		"total":       totalCount,
		"page":        page,
		"limit":       limit,
		"total_pages": (totalCount + int64(limit) - 1) / int64(limit),
	})
}

func GetProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var product models.Product
	if err := database.DB.Preload("Category").First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"product": product.ToResponse(),
	})
}

func CreateProduct(c *gin.Context) {
	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify category exists
	var category models.Category
	if err := database.DB.First(&category, req.CategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
		return
	}

	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Stock:       req.Stock,
		Image:       req.Image,
		CategoryID:  req.CategoryID,
	}

	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	// Load category relation
	database.DB.Preload("Category").First(&product, product.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Product created successfully",
		"product": product.ToResponse(),
	})
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var req UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Verify category exists if being updated
	if req.CategoryID != 0 {
		var category models.Category
		if err := database.DB.First(&category, req.CategoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
			return
		}
	}

	// Update product fields
	if req.Name != "" {
		product.Name = req.Name
	}
	if req.Description != "" {
		product.Description = req.Description
	}
	if req.Price > 0 {
		product.Price = req.Price
	}
	if req.Stock >= 0 {
		product.Stock = req.Stock
	}
	if req.Image != "" {
		product.Image = req.Image
	}
	if req.CategoryID != 0 {
		product.CategoryID = req.CategoryID
	}

	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	// Load category relation
	database.DB.Preload("Category").First(&product, product.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"product": product.ToResponse(),
	})
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	productID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Check if product is in any carts
	var cartCount int64
	database.DB.Model(&models.Cart{}).Where("product_id = ?", productID).Count(&cartCount)
	if cartCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot delete product that is in carts"})
		return
	}

	// Check if product is in any orders
	var orderItemCount int64
	database.DB.Model(&models.OrderItem{}).Where("product_id = ?", productID).Count(&orderItemCount)
	if orderItemCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot delete product that has been ordered"})
		return
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})
}
