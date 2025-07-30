package models

import (
	"time"
	"gorm.io/gorm"
)

type Category struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"type:varchar(100);not null;uniqueIndex"`
	Description string         `json:"description" gorm:"type:text"`
	Image       string         `json:"image" gorm:"type:varchar(255)"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	
	// Relations
	Products []Product `json:"products,omitempty" gorm:"foreignKey:CategoryID"`
}
