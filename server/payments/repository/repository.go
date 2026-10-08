package repository

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	payments "boko/payments"
)

type MemoryRepository struct {
	mu             sync.Mutex
	payments       map[string]*payments.PaymentRecord
	methods        map[string]*payments.PaymentMethod
	idempotency    map[string]payments.IdempotencyRecord
	processedEvents map[string]time.Time
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		payments:        make(map[string]*payments.PaymentRecord),
		methods:         make(map[string]*payments.PaymentMethod),
		idempotency:     make(map[string]payments.IdempotencyRecord),
		processedEvents: make(map[string]time.Time),
	}
}

func (r *MemoryRepository) SavePayment(_ context.Context, record *payments.PaymentRecord) error {
	if record == nil {
		return fmt.Errorf("record is nil")
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	record.UpdatedAt = time.Now()
	if record.CreatedAt.IsZero() {
		record.CreatedAt = record.UpdatedAt
	}
	r.payments[record.ID] = record
	return nil
}

func (r *MemoryRepository) SavePaymentMethod(_ context.Context, method *payments.PaymentMethod) error {
	if method == nil {
		return fmt.Errorf("method is nil")
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	method.UpdatedAt = time.Now()
	if method.CreatedAt.IsZero() {
		method.CreatedAt = method.UpdatedAt
	}
	r.methods[method.ID] = method
	return nil
}

func (r *MemoryRepository) GetIdempotency(key string) (payments.IdempotencyRecord, bool) {
	r.mu.Lock()
	defer r.mu.Unlock()
	record, ok := r.idempotency[key]
	return record, ok
}

func (r *MemoryRepository) SaveIdempotency(key string, response any) error {
	if key == "" {
		return nil
	}
	payload, err := json.Marshal(response)
	if err != nil {
		return err
	}
	sum := sha256.Sum256(payload)
	r.mu.Lock()
	defer r.mu.Unlock()
	r.idempotency[key] = payments.IdempotencyRecord{
		Key:        key,
		RequestHash: hex.EncodeToString(sum[:]),
		Response:   string(payload),
		CreatedAt:  time.Now(),
	}
	return nil
}

func (r *MemoryRepository) Payments() []*payments.PaymentRecord {
	r.mu.Lock()
	defer r.mu.Unlock()
	result := make([]*payments.PaymentRecord, 0, len(r.payments))
	for _, record := range r.payments {
		result = append(result, record)
	}
	return result
}

func (r *MemoryRepository) MarkEventProcessed(eventID string) error {
	if eventID == "" {
		return fmt.Errorf("event_id is required")
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.processedEvents[eventID] = time.Now()
	return nil
}

func (r *MemoryRepository) IsEventProcessed(eventID string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	_, ok := r.processedEvents[eventID]
	return ok
}
