package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Test passwords
	passwords := []string{"admin123", "customer123", "test123"}
	
	for _, pwd := range passwords {
		hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
		if err != nil {
			fmt.Printf("Error hashing %s: %v\n", pwd, err)
			continue
		}
		
		fmt.Printf("Password: %s\n", pwd)
		fmt.Printf("Hash: %s\n", string(hash))
		
		// Test verification
		err = bcrypt.CompareHashAndPassword(hash, []byte(pwd))
		if err != nil {
			fmt.Printf("Verification FAILED: %v\n", err)
		} else {
			fmt.Printf("Verification SUCCESS\n")
		}
		fmt.Println("---")
	}
}
