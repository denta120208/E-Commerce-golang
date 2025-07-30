package models

import (
	"time"
	"gorm.io/gorm"
)

type Order struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	UserID        uint           `json:"user_id" gorm:"not null"`
	TotalAmount   float64        `json:"total_amount" gorm:"type:decimal(10,2);not null"`
	Status        string         `json:"status" gorm:"type:varchar(50);default:pending"`
	ShippingAddress string       `json:"shipping_address" gorm:"type:text;not null"`
	PaymentMethod string         `json:"payment_method" gorm:"type:varchar(50);not null"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
	
	// Relations
	User       User        `json:"user" gorm:"foreignKey:UserID"`
	OrderItems []OrderItem `json:"order_items" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	OrderID   uint           `json:"order_id" gorm:"not null"`
	ProductID uint           `json:"product_id" gorm:"not null"`
	Quantity  int            `json:"quantity" gorm:"not null"`
	Price     float64        `json:"price" gorm:"type:decimal(10,2);not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	
	// Relations
	Order   Order   `json:"-" gorm:"foreignKey:OrderID"`
	Product Product `json:"product" gorm:"foreignKey:ProductID"`
}

type OrderResponse struct {
	ID              uint                `json:"id"`
	UserID          uint                `json:"user_id"`
	TotalAmount     float64             `json:"total_amount"`
	Status          string              `json:"status"`
	ShippingAddress string              `json:"shipping_address"`
	PaymentMethod   string              `json:"payment_method"`
	CreatedAt       time.Time           `json:"created_at"`
	OrderItems      []OrderItemResponse `json:"order_items"`
}

type OrderItemResponse struct {
	ID        uint            `json:"id"`
	ProductID uint            `json:"product_id"`
	Quantity  int             `json:"quantity"`
	Price     float64         `json:"price"`
	Product   ProductResponse `json:"product"`
	Subtotal  float64         `json:"subtotal"`
}

func (o *Order) ToResponse() OrderResponse {
	var orderItems []OrderItemResponse
	for _, item := range o.OrderItems {
		orderItems = append(orderItems, item.ToResponse())
	}
	
	return OrderResponse{
		ID:              o.ID,
		UserID:          o.UserID,
		TotalAmount:     o.TotalAmount,
		Status:          o.Status,
		ShippingAddress: o.ShippingAddress,
		PaymentMethod:   o.PaymentMethod,
		CreatedAt:       o.CreatedAt,
		OrderItems:      orderItems,
	}
}

func (oi *OrderItem) ToResponse() OrderItemResponse {
	subtotal := oi.Price * float64(oi.Quantity)
	return OrderItemResponse{
		ID:        oi.ID,
		ProductID: oi.ProductID,
		Quantity:  oi.Quantity,
		Price:     oi.Price,
		Product:   oi.Product.ToResponse(),
		Subtotal:  subtotal,
	}
}
