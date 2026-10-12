package controllers

import (
	"testing"

	"boko/config"
	"boko/models"
)

func TestUserPublicPayloadIncludesDecryptedPhone(t *testing.T) {
	t.Setenv("APP_AES_KEY", "0123456789abcdef")

	plainPhone := "0901234567"
	cipherText, err := config.EncryptString(plainPhone)
	if err != nil {
		t.Fatalf("encrypt phone: %v", err)
	}

	user := models.User{
		ID:    1,
		Email: "demo@example.com",
		Name:  "Demo User",
		Phone: cipherText,
		Role:  "customer",
	}

	payload := userPublicPayload(user)
	phone, ok := payload["phone"].(string)
	if !ok {
		t.Fatalf("expected phone field to be present and string, got %#v", payload["phone"])
	}
	if phone != plainPhone {
		t.Fatalf("expected decrypted phone %q, got %q", plainPhone, phone)
	}
}
