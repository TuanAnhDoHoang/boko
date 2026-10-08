package payments

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

const (
	PaymentStatusPending        = "pending"
	PaymentStatusRequiresAction = "requires_action"
	PaymentStatusSucceeded      = "succeeded"
	PaymentStatusFailed         = "failed"
	PaymentStatusCanceled       = "canceled"
)

type CreatePaymentRequest struct {
	PaymentMethodID string `json:"payment_method_id"`
	Amount          int64  `json:"amount"`
	Currency        string `json:"currency"`
	OrderID         string `json:"order_id"`
	IdempotencyKey  string `json:"-"`
}

func (r CreatePaymentRequest) Validate() error {
	if strings.TrimSpace(r.PaymentMethodID) == "" {
		return fmt.Errorf("payment_method_id is required")
	}
	if r.Amount <= 0 {
		return fmt.Errorf("amount must be greater than zero")
	}
	if strings.TrimSpace(r.Currency) == "" {
		return fmt.Errorf("currency is required")
	}
	if strings.TrimSpace(r.OrderID) == "" {
		return fmt.Errorf("order_id is required")
	}
	return nil
}

func (r CreatePaymentRequest) MarshalJSON() ([]byte, error) {
	type alias CreatePaymentRequest
	masked := struct {
		alias
		PaymentMethodID string `json:"payment_method_id"`
	}{
		alias:           alias(r),
		PaymentMethodID: maskToken(r.PaymentMethodID),
	}
	return json.Marshal(masked)
}

func (r CreatePaymentRequest) String() string {
	b, _ := r.MarshalJSON()
	return string(b)
}

type SaveCardRequest struct {
	UserID     string            `json:"user_id"`
	Token      string            `json:"token"`
	Brand      string            `json:"brand"`
	Last4      string            `json:"last4"`
	ExpMonth   int               `json:"exp_month"`
	ExpYear    int               `json:"exp_year"`
	CustomerID string            `json:"customer_id,omitempty"`
	Consent    bool              `json:"consent"`
	Metadata   map[string]string `json:"metadata,omitempty"`
}

func (r SaveCardRequest) Validate() error {
	if strings.TrimSpace(r.UserID) == "" {
		return fmt.Errorf("user_id is required")
	}
	if !r.Consent {
		return fmt.Errorf("user consent is required before storing the card")
	}
	if strings.TrimSpace(r.Token) == "" {
		return fmt.Errorf("token is required")
	}
	if len(r.Last4) != 4 {
		return fmt.Errorf("last4 must contain exactly 4 digits")
	}
	return nil
}

type PaymentMethod struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Provider    string    `json:"provider"`
	CustomerID  string    `json:"customer_id,omitempty"`
	Token       string    `json:"token,omitempty"`
	Brand       string    `json:"brand,omitempty"`
	Last4       string    `json:"last4,omitempty"`
	ExpMonth    int       `json:"exp_month,omitempty"`
	ExpYear     int       `json:"exp_year,omitempty"`
	Fingerprint string    `json:"fingerprint,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Active      bool      `json:"active"`
}

func (m PaymentMethod) MaskedToken() string {
	return maskToken(m.Token)
}

func (m PaymentMethod) String() string {
	b, _ := m.MarshalJSON()
	return string(b)
}

func (m PaymentMethod) MarshalJSON() ([]byte, error) {
	type alias PaymentMethod
	out := struct {
		alias
		Token       string `json:"token"`
		Fingerprint string `json:"fingerprint,omitempty"`
	}{
		alias:       alias(m),
		Token:       m.MaskedToken(),
		Fingerprint: maskToken(m.Fingerprint),
	}
	return json.Marshal(out)
}

type PaymentRecord struct {
	ID                string    `json:"id"`
	OrderID           string    `json:"order_id"`
	PaymentMethodID   string    `json:"payment_method_id"`
	Provider          string    `json:"provider"`
	Amount            int64     `json:"amount"`
	Currency          string    `json:"currency"`
	Status            string    `json:"status"`
	ProviderPaymentID string    `json:"provider_payment_id,omitempty"`
	RequiresAction    bool      `json:"requires_action"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func (r PaymentRecord) String() string {
	b, _ := json.Marshal(r)
	return string(b)
}

type PaymentResult struct {
	ID                string `json:"id"`
	Status            string `json:"status"`
	ProviderPaymentID string `json:"provider_payment_id,omitempty"`
	RequiresAction    bool   `json:"requires_action"`
}

type IdempotencyRecord struct {
	Key         string    `json:"key"`
	RequestHash string    `json:"request_hash"`
	Response    string    `json:"response"`
	CreatedAt   time.Time `json:"created_at"`
}

type WebhookEvent struct {
	ID        string          `json:"id"`
	Type      string          `json:"type"`
	Timestamp int64           `json:"timestamp"`
	Payload   json.RawMessage `json:"payload"`
}

func (e WebhookEvent) String() string {
	body, _ := json.Marshal(struct {
		ID        string `json:"id"`
		Type      string `json:"type"`
		Timestamp int64  `json:"timestamp"`
	}{
		ID:        e.ID,
		Type:      e.Type,
		Timestamp: e.Timestamp,
	})
	return string(body)
}

func maskToken(value string) string {
	if strings.TrimSpace(value) == "" {
		return ""
	}
	if len(value) <= 8 {
		return strings.Repeat("*", len(value))
	}
	return value[:2] + strings.Repeat("*", len(value)-4) + value[len(value)-2:]
}
