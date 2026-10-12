-- ============================================================================
-- Bảng dữ liệu thanh toán — PCI SAQ A: KHÔNG lưu số thẻ (PAN)/CVV,
-- chỉ lưu provider_token do cổng cấp + metadata không nhạy cảm.
--
-- ⚠ user_id/order_id dùng BIGINT (không phải UUID) vì GORM model dùng kiểu
-- uint → Postgres bigint. Dùng UUID sẽ lỗi foreign key khi chạy migration.
--
-- ⚠ Bảng users/orders do GORM AutoMigrate tạo khi backend chạy lần đầu
-- (server/main.go), nên hãy chạy backend TRƯỚC khi chạy file này.
-- ============================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL DEFAULT 'visa',
    customer_id VARCHAR(128),
    provider_token TEXT NOT NULL,
    brand VARCHAR(32),
    last4 CHAR(4),
    exp_month SMALLINT,
    exp_year SMALLINT,
    fingerprint VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_provider_token ON payment_methods(provider_token);
CREATE INDEX IF NOT EXISTS idx_payment_methods_customer_id ON payment_methods(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_methods_user_customer ON payment_methods(user_id, customer_id)
WHERE customer_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    payment_method_id UUID NULL REFERENCES payment_methods(id) ON DELETE SET NULL,
    provider VARCHAR(32) NOT NULL DEFAULT 'visa',
    amount BIGINT NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    provider_payment_id VARCHAR(128),
    requires_action BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_method_id ON payments(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_provider_payment_id
ON payments(provider, provider_payment_id)
WHERE provider_payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(128) NOT NULL UNIQUE,
    source VARCHAR(32) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'received'
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
    key_hash VARCHAR(128) PRIMARY KEY,
    request_hash VARCHAR(128) NOT NULL,
    response JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS idx_idempotency_created_at ON idempotency_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_idempotency_expires_at ON idempotency_keys(expires_at);

COMMENT ON COLUMN payment_methods.provider_token IS 'Tokenized payment method from gateway; never PAN or CVV.';
COMMENT ON COLUMN payment_methods.brand IS 'Card brand, e.g. Visa. Non-sensitive.';
COMMENT ON COLUMN payment_methods.last4 IS 'Last four digits only; non-sensitive.';
COMMENT ON COLUMN payment_methods.exp_month IS 'Month expiry; non-sensitive.';
COMMENT ON COLUMN payment_methods.exp_year IS 'Year expiry; non-sensitive.';
COMMENT ON COLUMN payment_methods.fingerprint IS 'Gateway-issued card fingerprint; non-PAN.';
COMMENT ON COLUMN payment_methods.customer_id IS 'Gateway customer ID; non-sensitive but must be protected by least privilege.';
COMMENT ON COLUMN payments.provider_payment_id IS 'Gateway payment intent ID; not PAN or CVV.';
COMMENT ON COLUMN webhook_events.payload IS 'Raw event payload; must never contain PAN, CVV, or card data.';

-- ============================================================================
-- Cách "giấu" dữ liệu nhạy cảm của Boko:
--   1. Số thẻ  : KHÔNG lưu. Frontend dùng hosted fields/redirect của cổng
--                (PayPal button, VNPay redirect, MoMo). Backend chỉ nhận token.
--   2. PII     : users.name / users.phone / orders.phone / shipping_address
--                do EncryptString() mã hóa AES-256-GCM khi ghi, khoá đọc từ
--                biến môi trường (xem server/.env.example).
--   3. Mật khẩu: bcrypt một chiều.
--   4. email   : giữ plaintext có chủ đích vì đăng nhập tìm bằng
--                "WHERE email = ?". Nếu cần mã hóa email phải thêm blind index.
--   5. Log     : pmiddleware.NewRedactingLogger() xoá pan/cvv/token/api_key
--                trước khi ghi log.
-- ============================================================================

COMMIT;
