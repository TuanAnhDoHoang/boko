package crypto

import "testing"

func TestEncryptDecryptEnvelope(t *testing.T) {
	kek := make([]byte, 32)
	for i := range kek {
		kek[i] = byte(i + 1)
	}
	plain := []byte("4111111111111111")
	encrypted, err := EncryptEnvelope(plain, kek, "kms-key-1")
	if err != nil {
		t.Fatalf("encrypt failed: %v", err)
	}
	decrypted, err := encrypted.Decrypt(kek)
	if err != nil {
		t.Fatalf("decrypt failed: %v", err)
	}
	if string(decrypted) != string(plain) {
		t.Fatalf("expected decrypted value to match original; got %q", decrypted)
	}
}
