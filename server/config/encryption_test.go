package config

import "testing"

func TestEncryptDecryptString(t *testing.T) {
	t.Setenv("APP_AES_KEY", "0123456789abcdef0123456789abcdef")

	original := "+84123456789"
	encrypted, err := EncryptString(original)
	if err != nil {
		t.Fatalf("encrypt failed: %v", err)
	}
	if encrypted == "" || encrypted == original {
		t.Fatalf("expected encrypted value to differ from original")
	}

	decrypted, err := DecryptString(encrypted)
	if err != nil {
		t.Fatalf("decrypt failed: %v", err)
	}
	if decrypted != original {
		t.Fatalf("expected %q but got %q", original, decrypted)
	}
}
