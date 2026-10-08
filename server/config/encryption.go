package config

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
)

// GetAESKey đọc khóa mã hóa từ biến môi trường APP_AES_KEY hoặc AES_KEY.
// Khóa nên dài 16, 24 hoặc 32 bytes. Nếu không đủ độ dài, hash SHA-256 để sinh khóa 32 bytes.
func GetAESKey() ([]byte, error) {
	keyValue := strings.TrimSpace(os.Getenv("APP_AES_KEY"))
	if keyValue == "" {
		keyValue = strings.TrimSpace(os.Getenv("AES_KEY"))
	}
	if keyValue == "" {
		return nil, errors.New("missing APP_AES_KEY/AES_KEY in environment")
	}

	key := []byte(keyValue)
	if len(key) == 16 || len(key) == 24 || len(key) == 32 {
		return key, nil
	}

	if decoded, err := base64.StdEncoding.DecodeString(keyValue); err == nil && (len(decoded) == 16 || len(decoded) == 24 || len(decoded) == 32) {
		return decoded, nil
	}

	sum := sha256.Sum256(key)
	return sum[:], nil
}

// EncryptString mã hóa dữ liệu nhạy cảm bằng AES-256-GCM.
func EncryptString(plainText string) (string, error) {
	if strings.TrimSpace(plainText) == "" {
		return "", nil
	}

	key, err := GetAESKey()
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("create AES cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("create GCM: %w", err)
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("generate nonce: %w", err)
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(plainText), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptString giải mã dữ liệu đã mã hóa bằng AES-256-GCM.
func DecryptString(cipherText string) (string, error) {
	if strings.TrimSpace(cipherText) == "" {
		return "", nil
	}

	key, err := GetAESKey()
	if err != nil {
		return "", err
	}

	decoded, err := base64.StdEncoding.DecodeString(cipherText)
	if err != nil {
		return "", fmt.Errorf("decode base64: %w", err)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("create AES cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("create GCM: %w", err)
	}

	nonceSize := gcm.NonceSize()
	if len(decoded) < nonceSize {
		return "", errors.New("ciphertext too short")
	}

	nonce, ciphertext := decoded[:nonceSize], decoded[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("decrypt data: %w", err)
	}

	return string(plaintext), nil
}
