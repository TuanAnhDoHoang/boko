package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	p "boko/payments"
	"boko/payments/repository"
	"boko/payments/validator"
	"boko/payments/webhook"
)

type Gateway interface {
	CreatePaymentIntent(ctx context.Context, amount int64, currency, orderID, paymentMethodID string) (*p.PaymentResult, error)
}

type NoopGateway struct{}

func (NoopGateway) CreatePaymentIntent(_ context.Context, amount int64, currency, orderID, paymentMethodID string) (*p.PaymentResult, error) {
	if amount <= 0 {
		return nil, fmt.Errorf("amount must be positive")
	}
	return &p.PaymentResult{
		ID:                fmt.Sprintf("pi_%d", time.Now().UnixNano()),
		Status:            p.PaymentStatusRequiresAction,
		ProviderPaymentID: fmt.Sprintf("pay_%d", time.Now().UnixNano()),
		RequiresAction:    true,
	}, nil
}

type Service struct {
	repo     *repository.MemoryRepository
	gateway  Gateway
	verifier *webhook.Verifier
}

func NewPaymentService(repo *repository.MemoryRepository, gateway Gateway, verifier *webhook.Verifier) *Service {
	if repo == nil {
		repo = repository.NewMemoryRepository()
	}
	return &Service{repo: repo, gateway: gateway, verifier: verifier}
}

func (s *Service) CreatePayment(ctx context.Context, req p.CreatePaymentRequest) (*p.PaymentResult, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}
	if err := validator.ValidateCurrency(req.Currency); err != nil {
		return nil, err
	}
	if err := validator.ValidateAmount(req.Amount); err != nil {
		return nil, err
	}
	if req.IdempotencyKey != "" {
		if existing, ok := s.repo.GetIdempotency(req.IdempotencyKey); ok {
			if existing.Response != "" {
				var result p.PaymentResult
				if err := json.Unmarshal([]byte(existing.Response), &result); err == nil {
					return &result, nil
				}
			}
		}
	}

	record := &p.PaymentRecord{
		ID:              fmt.Sprintf("pay_%d", time.Now().UnixNano()),
		OrderID:         req.OrderID,
		PaymentMethodID: req.PaymentMethodID,
		Provider:        "visa",
		Amount:          req.Amount,
		Currency:        req.Currency,
		Status:          p.PaymentStatusPending,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}
	if err := s.repo.SavePayment(ctx, record); err != nil {
		return nil, err
	}
	if s.gateway == nil {
		return nil, fmt.Errorf("payment gateway is not configured")
	}
	result, err := s.gateway.CreatePaymentIntent(ctx, req.Amount, req.Currency, req.OrderID, req.PaymentMethodID)
	if err != nil {
		record.Status = p.PaymentStatusFailed
		record.UpdatedAt = time.Now()
		_ = s.repo.SavePayment(ctx, record)
		return nil, err
	}
	record.ProviderPaymentID = result.ProviderPaymentID
	record.Status = result.Status
	record.RequiresAction = result.RequiresAction
	record.UpdatedAt = time.Now()
	if err := s.repo.SavePayment(ctx, record); err != nil {
		return nil, err
	}
	if req.IdempotencyKey != "" {
		if err := s.repo.SaveIdempotency(req.IdempotencyKey, result); err != nil {
			return nil, err
		}
	}
	return result, nil
}

func (s *Service) SaveCard(ctx context.Context, req p.SaveCardRequest) (*p.PaymentMethod, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}
	method := &p.PaymentMethod{
		ID:          fmt.Sprintf("pm_%d", time.Now().UnixNano()),
		UserID:      req.UserID,
		Provider:    "visa",
		CustomerID:  req.CustomerID,
		Token:       req.Token,
		Brand:       req.Brand,
		Last4:       req.Last4,
		ExpMonth:    req.ExpMonth,
		ExpYear:     req.ExpYear,
		Fingerprint: req.Token,
		Active:      true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	if err := s.repo.SavePaymentMethod(ctx, method); err != nil {
		return nil, err
	}
	return method, nil
}

func (s *Service) HandleWebhook(ctx context.Context, payload []byte, timestamp, signature string) error {
	if s.verifier == nil {
		return fmt.Errorf("webhook verifier is not configured")
	}
	if !s.verifier.Verify(payload, timestamp, signature) {
		return fmt.Errorf("invalid webhook signature")
	}
	var ev map[string]any
	if err := json.Unmarshal(payload, &ev); err != nil {
		return err
	}
	eventID, _ := ev["id"].(string)
	if eventID != "" && s.repo.IsEventProcessed(eventID) {
		return nil
	}
	status, _ := ev["status"].(string)
	if status == "" {
		status = p.PaymentStatusSucceeded
	}
	if eventID != "" {
		if err := s.repo.MarkEventProcessed(eventID); err != nil {
			return err
		}
	}
	if orderID, ok := ev["order_id"].(string); ok && orderID != "" {
		for _, rec := range s.repo.Payments() {
			if rec.OrderID == orderID {
				rec.Status = status
				rec.UpdatedAt = time.Now()
				_ = s.repo.SavePayment(ctx, rec)
			}
		}
	}
	return nil
}

func hashRequest(req any) string {
	payload, _ := json.Marshal(req)
	sum := sha256.Sum256(payload)
	return hex.EncodeToString(sum[:])
}
