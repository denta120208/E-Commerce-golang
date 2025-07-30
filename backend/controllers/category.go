package controllers

import (
	"net/http"
	"strconv"
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"github.com/gin-gonic/gin"
)

type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type UpdateCategoryRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

func GetCategories(c *gin.Context) {
	var categories []models.Category
	
	if err := database.DB.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
	})
}

func GetCategory(c *gin.Context) {
	id := c.Param("id")
	categoryID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.Category
	if err := database.DB.Preload("Products").First(&category, categoryID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"category": category,
	})
}

func CreateCategory(c *gin.Context) {
	var req CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if category already exists
	var existingCategory models.Category
	if err := database.DB.Where("name = ?", req.Name).First(&existingCategory).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Category already exists"})
		return
	}

	category := models.Category{
		Name:        req.Name,
		Description: req.Description,
		Image:       req.Image,
	}

	if err := database.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Category created successfully",
		"category": category,
	})
}

func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	categoryID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var req UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var category models.Category
	if err := database.DB.First(&category, categoryID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	// Check if new name already exists (if name is being updated)
	if req.Name != "" && req.Name != category.Name {
		var existingCategory models.Category
		if err := database.DB.Where("name = ? AND id != ?", req.Name, categoryID).First(&existingCategory).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Category name already exists"})
			return
		}
	}

	// Update category fields
	if req.Name != "" {
		category.Name = req.Name
	}
	if req.Description != "" {
		category.Description = req.Description
	}
	if req.Image != "" {
		category.Image = req.Image
	}

	if err := database.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Category updated successfully",
		"category": category,
	})
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	categoryID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.Category
	if err := database.DB.First(&category, categoryID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	// Check if category has products
	var productCount int64
	database.DB.Model(&models.Product{}).Where("category_id = ?", categoryID).Count(&productCount)
	if productCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot delete category with existing products"})
		return
	}

	if err := database.DB.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Category deleted successfully",
	})
}
