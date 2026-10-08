# PCI-aware Visa payment module

## Mục tiêu

Module này hướng tới mô hình SAQ A/SAQ A-EP: frontend tạo hosted fields/iframe của cổng thanh toán, backend không nhận PAN, CVV hoặc số thẻ thô. Backend chỉ lưu `payment_method_id` hoặc token do cổng cấp. Dữ liệu nhạy cảm được giữ trong PCI scope tối thiểu và chỉ lưu ở nơi cổng thanh toán hay trong KMS-backed encrypted storage khi bắt buộc.

## Quyết định thiết kế

1. Không lưu PAN hoặc CVV.
   - `payment_methods.provider_token` lưu token từ cổng, không phải PAN.
   - Thông tin thẻ được lưu tối thiểu: brand, last4, exp month/year, fingerprint, customer_id.
2. Idempotency cho tối ưu xử lý trùng.
   - `Idempotency-Key` được yêu cầu cho API tạo thanh toán.
   - Kết quả được lưu theo khóa và trả lại cùng response nếu gửi lại request tương tự.
3. Webhook phải được xác thực bằng HMAC constant-time.
   - Timestamp được kiểm tra trong khoảng cho phép để ngăn replay.
   - `event_id` được lưu để xử lý idempotent.
4. Mã hóa PAN khi bắt buộc lưu.
   - Dùng AES-256-GCM với nonce 12 byte và KEK từ KMS/HSM.
   - `HMAC-SHA256` riêng được dùng cho search/deduplication.
   - Hỗ trợ rotation khóa và re-encryption.
5. Logging luôn redact.
   - Middleware xóa các trường như `pan`, `cvv`, `token`, `api_key`, `webhook_secret` trước khi ghi log.
   - Struct có `String()`/`MarshalJSON()` che dữ liệu nhạy cảm.

## Cấu hình cần thay thực tế

- `PAYMENT_PROVIDER_API_KEY`: khóa API provider.
- `PAYMENT_WEBHOOK_SECRET`: secret cho webhook signature.
- `KMS_KEY_ID`: key ID trên AWS KMS/HashiCorp Vault/GCP KMS.
- `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_NAME` cho PostgreSQL.
- `TLS_CERT_FILE`, `TLS_KEY_FILE` nếu chạy HTTPS trực tiếp.

## Rủi ro còn lại

- Nếu frontend không dùng hosted fields/iframe của cổng, phạm vi PCI tăng mạnh.
- Nếu endpoint webhook không validate timestamp/key chặt chẽ, vẫn có thể bị replay.
- Nếu log tập trung/monitoring chứa body raw hoặc request header, cần thêm redaction ở tầng proxy/ELK.
- Nếu dịch vụ dùng `string` cho token/PAN ở nhiều nơi, cần dọn sạch trong bộ nhớ hoặc dùng byte slice + zeroize.

## Checklist PCI DSS đối chiếu

- SAQ A: backend không xử lý PAN, CVV, track data; tokenization via hosted fields.
- Tường lửa/least privilege: DB service account chỉ quyền cần thiết; KMS key access được phân quyền.
- Giám sát: activity logging, audit trail, rate limiting, lockout.
- Thuật toán: HMAC constant-time, chuẩn TLS 1.2+, timeout & body limits.

## Mở rộng đề xuất

- Tích hợp Stripe/Adyen/VNPay/OnePay bằng provider adapter pattern.
- Chuyển MemoryRepository sang GORM/SQLC và query parameterized.
- Thêm cron rotation khóa và dead-letter-queue cho webhook thất bại.
