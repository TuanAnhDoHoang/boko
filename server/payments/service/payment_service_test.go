package service

import (
	"context"
	"testing"
	"time"

	p "boko/payments"
	"boko/payments/repository"
	"boko/payments/webhook"
)

func TestPaymentServiceIdempotency(t *testing.T) {
	service := NewPaymentService(repository.NewMemoryRepository(), NoopGateway{}, webhook.NewVerifier("whsec_test"))
	request := p.CreatePaymentRequest{PaymentMethodID: "pm_123", Amount: 150000, Currency: "USD", OrderID: "ord_001", IdempotencyKey: "idem-1"}
	first, err := service.CreatePayment(context.Background(), request)
	if err != nil {
		t.Fatalf("first payment failed: %v", err)
	}
	second, err := service.CreatePayment(context.Background(), request)
	if err != nil {
		t.Fatalf("second payment failed: %v", err)
	}
	if first.ID == "" || second.ID == "" {
		t.Fatal("unexpected empty payment ID")
	}
	if first.ProviderPaymentID != second.ProviderPaymentID {
		t.Fatal("expected same idempotent response for identical key")
	}
	if time.Now().Year() < 2024 {
		t.Fatal("unexpected test clock condition")
	}
}
