package models

import (
	"time"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"type:varchar(255);not null"`
	Description string         `json:"description" gorm:"type:text"`
	Price       float64        `json:"price" gorm:"type:decimal(10,2);not null"`
	Stock       int            `json:"stock" gorm:"default:0"`
	Image       string         `json:"image" gorm:"type:varchar(255)"`
	CategoryID  uint           `json:"category_id" gorm:"not null"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	
	// Relations
	Category Category    `json:"category" gorm:"foreignKey:CategoryID"`
	Carts    []Cart      `json:"-" gorm:"foreignKey:ProductID"`
	Orders   []OrderItem `json:"-" gorm:"foreignKey:ProductID"`
}

type ProductResponse struct {
	ID          uint     `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	Stock       int      `json:"stock"`
	Image       string   `json:"image"`
	CategoryID  uint     `json:"category_id"`
	Category    Category `json:"category"`
	CreatedAt   time.Time `json:"created_at"`
}

func (p *Product) ToResponse() ProductResponse {
	return ProductResponse{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		Stock:       p.Stock,
		Image:       p.Image,
		CategoryID:  p.CategoryID,
		Category:    p.Category,
		CreatedAt:   p.CreatedAt,
	}
}
