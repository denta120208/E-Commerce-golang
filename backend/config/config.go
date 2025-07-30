package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Set default values if not set
	if os.Getenv("PORT") == "" {
		os.Setenv("PORT", "8080")
	}
	if os.Getenv("JWT_SECRET") == "" {
		os.Setenv("JWT_SECRET", "your-secret-key")
	}
	if os.Getenv("DB_HOST") == "" {
		os.Setenv("DB_HOST", "localhost")
	}
	if os.Getenv("DB_PORT") == "" {
		os.Setenv("DB_PORT", "3306")
	}
	if os.Getenv("DB_USER") == "" {
		os.Setenv("DB_USER", "root")
	}
	if os.Getenv("DB_PASSWORD") == "" {
		os.Setenv("DB_PASSWORD", "")
	}
	if os.Getenv("DB_NAME") == "" {
		os.Setenv("DB_NAME", "ecommerce_db")
	}
}
