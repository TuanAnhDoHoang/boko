package webhook

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"
)

type Verifier struct {
	Secret  []byte
	MaxSkew time.Duration
}

func NewVerifier(secret string) *Verifier {
	return &Verifier{
		Secret:  []byte(secret),
		MaxSkew: 5 * time.Minute,
	}
}

func ComputeSignature(secret string, payload []byte, timestamp int64) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strconv.FormatInt(timestamp, 10)))
	mac.Write([]byte("."))
	mac.Write(payload)
	return hex.EncodeToString(mac.Sum(nil))
}

func (v *Verifier) Verify(payload []byte, timestamp string, signature string) bool {
	if v == nil || len(v.Secret) == 0 || strings.TrimSpace(timestamp) == "" || strings.TrimSpace(signature) == "" {
		return false
	}
	unixTS, err := strconv.ParseInt(timestamp, 10, 64)
	if err != nil {
		return false
	}
	if unixTS <= 0 {
		return false
	}
	then := time.Unix(unixTS, 0)
	if time.Since(then) > v.MaxSkew || then.After(time.Now().Add(v.MaxSkew)) {
		return false
	}
	expected := ComputeSignature(string(v.Secret), payload, unixTS)
	if strings.HasPrefix(signature, "v1=") {
		signature = strings.TrimPrefix(signature, "v1=")
	}
	if strings.HasPrefix(signature, "sha256=") {
		signature = strings.TrimPrefix(signature, "sha256=")
	}
	if !hmac.Equal([]byte(expected), []byte(signature)) {
		return false
	}
	return true
}

func (v *Verifier) VerifyWithConfig(payload []byte, timestamp, signature string) error {
	if !v.Verify(payload, timestamp, signature) {
		return fmt.Errorf("webhook verification failed")
	}
	return nil
}
