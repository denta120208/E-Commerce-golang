package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Email     string         `json:"email" gorm:"type:varchar(255);uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"type:varchar(255);not null"`
	FirstName string         `json:"first_name" gorm:"type:varchar(100);not null"`
	LastName  string         `json:"last_name" gorm:"type:varchar(100);not null"`
	Phone     string         `json:"phone" gorm:"type:varchar(20)"`
	Address   string         `json:"address" gorm:"type:text"`
	Role      string         `json:"role" gorm:"type:varchar(20);default:customer"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	
	// Relations
	Orders []Order `json:"orders,omitempty" gorm:"foreignKey:UserID"`
	Carts  []Cart  `json:"carts,omitempty" gorm:"foreignKey:UserID"`
}

type UserResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Phone     string    `json:"phone"`
	Address   string    `json:"address"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Phone:     u.Phone,
		Address:   u.Address,
		Role:      u.Role,
		CreatedAt: u.CreatedAt,
	}
}
