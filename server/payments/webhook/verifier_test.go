package webhook

import (
	"strconv"
	"testing"
	"time"
)

func TestVerifierVerify(t *testing.T) {
	secret := "whsec_test_secret"
	payload := []byte(`{"id":"evt_test_123","type":"payment.succeeded"}`)
	timestamp := time.Now().Unix()
	signature := ComputeSignature(secret, payload, timestamp)
	v := NewVerifier(secret)
	if !v.Verify(payload, strconv.FormatInt(timestamp, 10), signature) {
		t.Fatal("expected valid signature to verify")
	}
	if v.Verify(payload, "0", signature) {
		t.Fatal("expected expired timestamp to fail")
	}
}
