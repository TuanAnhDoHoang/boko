package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
)

type EnvelopeCiphertext struct {
	KeyID      string `json:"key_id"`
	Nonce      string `json:"nonce"`
	CipherText string `json:"ciphertext"`
}

func EncryptEnvelope(plain []byte, kek []byte, keyID string) (*EnvelopeCiphertext, error) {
	if len(kek) != 32 {
		return nil, fmt.Errorf("KEK must be 32 bytes for AES-256")
	}
	block, err := aes.NewCipher(kek)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}
	ciphertext := gcm.Seal(nil, nonce, plain, nil)
	return &EnvelopeCiphertext{
		KeyID:      keyID,
		Nonce:      base64.StdEncoding.EncodeToString(nonce),
		CipherText: base64.StdEncoding.EncodeToString(ciphertext),
	}, nil
}

func (e *EnvelopeCiphertext) Decrypt(kek []byte) ([]byte, error) {
	if e == nil {
		return nil, fmt.Errorf("ciphertext is nil")
	}
	if len(kek) != 32 {
		return nil, fmt.Errorf("KEK must be 32 bytes for AES-256")
	}
	block, err := aes.NewCipher(kek)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce, err := base64.StdEncoding.DecodeString(e.Nonce)
	if err != nil {
		return nil, err
	}
	ciphertext, err := base64.StdEncoding.DecodeString(e.CipherText)
	if err != nil {
		return nil, err
	}
	return gcm.Open(nil, nonce, ciphertext, nil)
}

func (e *EnvelopeCiphertext) MarshalJSON() ([]byte, error) {
	if e == nil {
		return []byte("null"), nil
	}
	type alias EnvelopeCiphertext
	return json.Marshal(alias(*e))
}
