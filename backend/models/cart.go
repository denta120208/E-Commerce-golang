package models

import (
	"time"
	"gorm.io/gorm"
)

type Cart struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	UserID    uint           `json:"user_id" gorm:"not null"`
	ProductID uint           `json:"product_id" gorm:"not null"`
	Quantity  int            `json:"quantity" gorm:"not null;default:1"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	
	// Relations
	User    User    `json:"user" gorm:"foreignKey:UserID"`
	Product Product `json:"product" gorm:"foreignKey:ProductID"`
}

type CartResponse struct {     
	ID        uint            `json:"id"`
	UserID    uint            `json:"user_id"`
	ProductID uint            `json:"product_id"`
	Quantity  int             `json:"quantity"`
	Product   ProductResponse `json:"product"`
	CreatedAt time.Time       `json:"created_at"`
	Subtotal  float64         `json:"subtotal"`
}

func (c *Cart) ToResponse() CartResponse {
	subtotal := c.Product.Price * float64(c.Quantity)
	return CartResponse{
		ID:        c.ID,
		UserID:    c.UserID,
		ProductID: c.ProductID,
		Quantity:  c.Quantity,
		Product:   c.Product.ToResponse(),
		CreatedAt: c.CreatedAt,
		Subtotal:  subtotal,
	}
}
